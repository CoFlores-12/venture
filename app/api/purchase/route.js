import { NextResponse } from 'next/server';
import Purchase from '@/src/models/purchase';
import Event from '@/src/models/event';
import user from '@/src/models/Users';
import { connectToMongoose } from '@/src/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CryptoJS from "crypto-js";

const secret = process.env.QR_SECRET;

//registra una nueva nueva venta
export async function POST(req) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
    }

    const user = session.user?.id;
    
    const body = await req.json();
    const {event, ticketQuantity, typeTicket} = body;

    if (!event || !ticketQuantity || !typeTicket ) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectToMongoose();

    const eventFind = await Event.findById(event);
    if (!eventFind) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    const selectedTicket = eventFind.tickets.find(ticket => ticket.name === typeTicket);

    if (!selectedTicket) {
      return NextResponse.json({ error: "Tipo de boleto no válido" }, { status: 400 });
    }

    if (selectedTicket.quantityAvailable < ticketQuantity) {
      return NextResponse.json({ error: "No hay suficientes boletos disponibles" }, { status: 400 });
    }

    const totalAmount = selectedTicket.price * ticketQuantity;

    selectedTicket.quantityAvailable -= ticketQuantity;
    await eventFind.save();

    const newPurchase = await Purchase.create({
      user,
      event,
      ticketQuantity,
      totalAmount,
      typeTicket,
    });

    const tokenPayload = JSON.stringify({
      userId: newPurchase.user.toString(),
      purchaseId: newPurchase._id.toString()
    });

    const encryptedToken = CryptoJS.AES.encrypt(tokenPayload, secret).toString();

    newPurchase.token = encryptedToken;

    await newPurchase.save();
    const returnPurchase = {
      ...newPurchase.toObject(),
      eventName: eventFind.title,
      date: eventFind.date,
      time: eventFind.time,
      position: eventFind.position,
      location: eventFind.location
    }

    return NextResponse.json({ returnPurchase }, { status: 201 });


      } catch (error) {
        console.error('Purchase creation error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
}

// trae todas las compras
export async function GET() {
  try {
    
    await connectToMongoose();

    const purchases = await Purchase.find()
      // falta hacer los join con el usuario de la compra
      .populate({
        path: "event",
        select: "title date",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(purchases, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching purchases", details: error.message },
      { status: 500 }
    );
  }
}
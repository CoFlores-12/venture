import { NextResponse } from 'next/server';
import Purchase from '@/src/models/purchase';
import Event from '@/src/models/event';
import { connectToMongoose } from '@/src/lib/db';

//registra una nueva nueva venta
export async function POST(req) {
  await connectToMongoose();

  try {
    const body = await req.json();
    const { user, event, ticketQuantity, typeTicket} = body;

    if (!user || !event || !ticketQuantity || !typeTicket ) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

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
          typeTicket
        });

        return NextResponse.json(newPurchase, { status: 201 });

      } catch (error) {
        console.error('Purchase creation error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
}

// trea todos las compras
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
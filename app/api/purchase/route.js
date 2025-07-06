import { NextResponse } from 'next/server';
import Purchase from '@/src/models/purchase';
import { connectToMongoose } from '@/src/lib/db';

export async function POST(req) {
  await connectToMongoose();

  try {
    const body = await req.json();
    const { user, event, ticketQuantity, totalAmount } = body;

    if (!user || !event || !ticketQuantity || !totalAmount) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newPurchase = await Purchase.create({
      user,
      event,
      ticketQuantity,
      totalAmount,
    });

    return NextResponse.json(newPurchase, { status: 201 });

  } catch (error) {
    console.error('Purchase creation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectToMongoose();

    const purchases = await Purchase.find()
      // falta hacer los join con el evento y el usuario de la compra
      .sort({ createdAt: -1 }); 

    return NextResponse.json(purchases, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching purchases", details: error.message },
      { status: 500 }
    );
  }
}
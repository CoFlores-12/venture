import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Purchase from '@/src/models/purchase';

export async function GET(request, context) {
  try {
    await connectToMongoose();
    const { userId } = await context.params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Falta el ID del usuario' }, { status: 400 });
    }

    const purchases = await Purchase.find({ user: userId })
      .populate({
        path: "event",
        select: "title date banner",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(purchases, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las compras", details: error.message },
      { status: 500 }
    );
  }
}

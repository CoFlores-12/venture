import { NextResponse } from 'next/server';
import Purchase from '@/src/models/purchase';
import { connectToMongoose } from '@/src/lib/db';

// trae todas las  compras de un usario en espacifico
export async function GET(request, { params }) {
  try {
    await connectToMongoose();

    const Id = params.userId; // recive el id del usuario

    if (!Id) {
      return NextResponse.json({ error: "Falta el ID del usuario" }, { status: 400 });
    }

    const purchases = await Purchase.find({ user: Id })
      .populate({
        path: "event",
        select: "title date",
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

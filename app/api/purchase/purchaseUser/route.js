import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Purchase from '@/src/models/purchase';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// obtiene las compras del usario en la sesoin actual
export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
    }

    await connectToMongoose();
    
    const userId = session.user?.id;

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

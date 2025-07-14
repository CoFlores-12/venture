import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Purchase from '@/src/models/purchase';
import mongoose from "mongoose";
import Event from '@/src/models/event';
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

    const purchases = await Purchase.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "eventData"
        }
      },
      { $unwind: "$eventData" },
      {
        $replaceRoot: { newRoot: "$eventData" }
      },
      {
        $project: {
          eventName: "$title",
          date: 1,
          time: 1,
          position: 1,
          location: 1
        }
      }
    ]);


    return NextResponse.json(purchases, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las compras", details: error.message },
      { status: 500 }
    );
  }
}

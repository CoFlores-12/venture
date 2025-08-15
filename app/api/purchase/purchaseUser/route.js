import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Purchase from '@/src/models/purchase';
import mongoose from "mongoose";
import Event from '@/src/models/event';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CryptoJS from "crypto-js";
const secret = process.env.QR_SECRET;

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
    }

    await connectToMongoose();
    
    const userId = session.user?.id;

   const purchases = await Purchase.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "fullEvent"
        }
      },
      {
        $unwind: "$fullEvent"
      },
      {
        $addFields: {
            eventName: "$fullEvent.title",
            date: "$fullEvent.date",
            time: "$fullEvent.time",
            position: "$fullEvent.position",
            location: "$fullEvent.location"
          
        }
      },
      {
        $project: {
          fullEvent: 0 
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

   const purchasesWithTokens = purchases.map(purchase => {
  const tokenPayload = JSON.stringify({
    userId: userId,
    purchaseId: purchase._id.toString()
  });

  const encryptedToken = CryptoJS.AES.encrypt(tokenPayload, secret).toString();

  return {
    ...purchase,
    token: encryptedToken
  };
});

    return NextResponse.json(purchasesWithTokens, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las compras", details: error.message },
      { status: 500 }
    );
  }
}

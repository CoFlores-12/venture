// app/api/likes/user/likeUser/type= "evet" || "user"
import { NextResponse } from "next/server";
import { connectToMongoose } from '@/src/lib/db';
import Like from "@/src/models/like";
import Event from "@/src/models/event";
import User from "@/src/models/Users";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// obtiene los me gusta del usuario en la sesion actual
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
    }

    await connectToMongoose();

    const Id = session.user?.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "event" o "user"

    if (!["event", "user"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const targetCollection = type === "event" ? "events" : "users";
    const projection = type === "event" ? { title: 1, date: 1 } : { nombre: 1, correo: 1 };

    const likedData = await Like.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(Id), targetType: type } },
      {
        $lookup: {
          from: targetCollection,
          localField: "targetId",
          foreignField: "_id",
          as: "targetDetails"
        }
      },
      { $unwind: "$targetDetails" },
      {
        $replaceRoot: {
          newRoot: "$targetDetails"
        }
      },
      {
        $project: projection
      }
    ]);

    return NextResponse.json(likedData);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}

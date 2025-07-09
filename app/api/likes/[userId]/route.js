// app/api/likes/user/[userId]/route.js
import { NextResponse } from "next/server";
import { connectToMongoose } from '@/src/lib/db';
import Like from "@/src/models/like";
import Event from "@/src/models/event";
import User from "@/src/models/Users";

export async function GET(request, { params }) {
  try {
    await connectToMongoose();
    const Id = params.userId
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "event" o "user"

    if (!["event", "user"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const likes = await Like.find({ user: Id, targetType: type });

    const ids = likes.map(like => like.targetId);
    const data = type === "event" ? await Event.find({ _id: { $in: ids } }).select("title date"): await User.find({ _id: { $in: ids } }).select("nombre correo");

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}

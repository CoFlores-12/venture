import { NextResponse } from "next/server";
import Like from "@/src/models/like";
import { connectToMongoose } from '@/src/lib/db';

export async function POST(req) {
  await connectToMongoose();
  const { userId, targetId, targetType } = await req.json(); // targetType = "user" | "event"

  if (!["event", "user"].includes(targetType)) {
    return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
  }

  try {
    const existingLike = await Like.findOne({ user: userId, targetId, targetType });

    if (existingLike) {
      await existingLike.deleteOne();
      return NextResponse.json({ message: "Like removed" });
    }

    const newLike = await Like.create({ user: userId, targetId, targetType });
    return NextResponse.json({ message: "Like added", like: newLike });

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
  }
}
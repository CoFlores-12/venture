import { NextResponse } from "next/server";
import { connectToMongoose } from '@/src/lib/db';
import Like from "@/src/models/like";
import Event from "@/src/models/event";
import User from "@/src/models/Users";

export async function GET() {
  await connectToMongoose();

  // Most liked events
  const mostLikedEvents = await Like.aggregate([
    { $match: { targetType: "event" } },
    { $group: { _id: "$targetId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event"
      }
    },
    { $unwind: "$event" },
    {
      $project: {
        _id: 0,
        event: 1,
        likeCount: "$count"
      }
    }
  ]);

  // Most liked organizers (users)
  const mostLikedOrganizers = await Like.aggregate([
    { $match: { targetType: "user" } },
    { $group: { _id: "$targetId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        user: 1,
        likeCount: "$count"
      }
    }
  ]);

  return NextResponse.json({
    mostLikedEvents,
    mostLikedOrganizers
  });
} 
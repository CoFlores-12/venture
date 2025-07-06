import connectDB from '@/src/lib/db';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const events = await Event.find({});
  return NextResponse.json(events);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const event = await Event.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}

import { connectToMongoose } from '@/src/lib/db'; 
import Event from '@/src/models/event';
import { NextResponse } from 'next/server';


//se obtienen todos los eventos 
export async function GET() {
  await connectToMongoose();
  const events = await Event.find({});
  return NextResponse.json(events);
}
//se agrega un evento
export async function POST(req) {
  await connectToMongoose();
  const body = await req.json();

  try {
    const event = await Event.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}

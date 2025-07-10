import { connectToMongoose } from '@/src/lib/db'; 
import Event from '@/src/models/event';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectToMongoose();

  try {
    const event = await Event.findById(params.id).populate('organizer', 'nombre _id foto');

    //TODO: return rating & # events of organizer

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching event" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectToMongoose();

  try {
    await Event.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}

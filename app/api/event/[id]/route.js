import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Event from '@/src/models/event';

export async function GET(request, context) {
  try {
    await connectToMongoose();
    const { id } = await context.params;
    const event = await Event.findById(id).populate('organizer', 'nombre _id foto');
    //TODO: return rating & # events of organizer
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
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

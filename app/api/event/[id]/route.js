import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Event from '@/src/models/event';
import axios from 'axios';

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

export async function PUT(req, context) {
  await connectToMongoose();
  const { id } = await context.params;
  try {
    const body = await req.json();
    let bannerUrl = body.banner;

    // If a new bannerPreview is provided and looks like base64, upload it to imgbb
    if (body.bannerPreview && body.bannerPreview.length > 100 && !body.bannerPreview.startsWith('http')) {
      const formData = new URLSearchParams();
      formData.append('key', process.env.IMGBB_API_KEY);
      formData.append('image', body.bannerPreview);
      const upload = await axios.post('https://api.imgbb.com/1/upload', formData);
      bannerUrl = upload.data?.data?.url;
      if (!bannerUrl) {
        return NextResponse.json({ error: 'No se pudo subir el banner' }, { status: 500 });
      }
    }

    // Only update allowed fields
    const updateFields = {
      title: body.title,
      description: body.description,
      location: body.location,
      date: body.date,
      time: body.time,
      plan: body.plan,
      category: body.category,
      emoji: body.emoji,
      position: body.position,
      tickets: body.tickets,
      banner: bannerUrl,
    };
    // Remove undefined fields
    Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);
    const updatedEvent = await Event.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating event' }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await connectToMongoose();
  const { id } = await context.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}

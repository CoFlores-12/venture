import { connectToMongoose } from '@/src/lib/db'; 
import Event from '@/src/models/event';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";




//se obtienen todos los eventos 
export async function GET() {
  await connectToMongoose();
  const events = await Event.find({});
  return NextResponse.json(events);
}
//se agrega un evento
export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
  }
  
   const body = await req.json();

    const {
      title,
      description,
      location,
      date,
      time,
      distance,
      plan,
      category,
      emoji,
      position,
      tickets,
      bannerPreview,
    } = body;

    if (!bannerPreview) {
      return NextResponse.json({ error: "Falta imagen del banner" }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", bannerPreview);

    const upload = await axios.post("https://api.imgbb.com/1/upload", formData);
    const bannerUrl = upload.data?.data?.url;

    if (!bannerUrl) {
      return NextResponse.json({ error: "No se pudo subir el banner" }, { status: 500 });
    }

    let featured = false;

    if (plan.trim() == "enterprise" || plan.trim() == "premium") {
      featured = true
    }

  try {
    await connectToMongoose();
    const newEvent = await Event.create({
      title,
      description,
      location,
      date,
      time,
      distance,
      plan,
      category,
      position,
      tickets,
      featured,
      banner: bannerUrl,
      organizer: session.user?.id
    });
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}

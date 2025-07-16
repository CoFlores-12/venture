import { connectToMongoose } from '@/src/lib/db'; 
import Event from '@/src/models/event';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";
import Like from '@/src/models/like'; // <--- NUEVA IMPORTACIÓN: Para buscar likes a organizadores
import User from '@/src/models/user';
import { dispatchNotificationEvent } from '@/src/lib/eventDispatcher';




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

    const organizerUser = await User.findById(session.user?.id); 
    
    if (organizerUser) {
        // Encontrar todos los "likes" donde el targetType es 'user' y el targetId es el ID del organizador
        const favoriteLikes = await Like.find({ 
            targetType: 'user', 
            targetId: organizerUser._id 
        }).lean();

        if (favoriteLikes.length > 0) {
            //Obtener los IDs de los usuarios que dieron like
            const favoriteUserIds = favoriteLikes.map(like => like.user);

            //Obtener los detalles de esos usuarios (principalmente su correo)
            const favoriteUsers = await User.find({ _id: { $in: favoriteUserIds } }).select('nombre correo').lean();

            //Delegar una notificación para cada usuario favorito
            for (const favUser of favoriteUsers) {
                if (favUser.correo) {
                    dispatchNotificationEvent('favorite_user_event', {
                        newEvent: newEvent.toObject(), // El evento recién creado
                        favoriteUser: organizerUser.toObject(), // El organizador que publicó el evento
                        recipient: favUser.toObject(), // El usuario que es favorito y recibirá el correo
                    });
                } else {
                    console.warn(`Advertencia: Usuario favorito ${favUser.nombre} no tiene correo para notificación.`);
                }
            }
            console.log(`✅ Notificaciones delegadas para ${favoriteUsers.length} usuarios favoritos.`);
        } else {
            console.log('No hay usuarios que hayan marcado a este organizador como favorito.');
        }
    } else {
        console.warn('Advertencia: No se pudo encontrar el organizador para notificar a sus favoritos.');
    }

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}

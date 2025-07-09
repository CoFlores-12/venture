import { connectToMongoose } from '@/src/lib/db';
import users from '@/src/models/Users';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";

export async function GET(req) {
  await connectToMongoose();

  try {
    const user = await users.find({verificado: false});

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No hay usuarios pendientes de verificación' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const {
        organizationName,
        documentType,
        documentNumber,
        phone,
        address,
        organizationDesc,
        documentImageBase64, 
      } = body;

    if (
      !organizationName || !documentType || !documentNumber ||
      !phone || !address || !organizationDesc || !documentImageBase64
    ) {
      return NextResponse.json({ success: false, message: "Todos los campos son requeridos." }, { status: 400 });
    }

    await connectToMongoose();

    const user = await users.findById(session.user?.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado." }, { status: 404 });
    }
    if (user.verificado != null && !user.verificado) {
      return NextResponse.json({ success: false, message: "Ya tienes una solicitud pendiente." }, { status: 404 });
    }

    const formData = new FormData();
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    formData.append("key", imgbbApiKey);
    formData.append("image", documentImageBase64);

    const imgbbRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    const imageUrl = imgbbRes.data?.data?.url;
    if (!imageUrl) {
      return NextResponse.json({ success: false, message: "Error al subir imagen." }, { status: 500 });
    }

    user.organizacion = organizationName;
    user.documentType = documentType;
    user.identidad = documentNumber;
    user.contacto = phone;
    user.ubicacion = address;
    user.descripcion = organizationDesc;
    user.identidadDoc = imageUrl;
    user.verificado = false;

    await user.save();

    return NextResponse.json({ success: true, message: "Solicitud enviada. Espera la verificación." });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ success: false, message: "Error del servidor." }, { status: 500 });
  }


}

import { connectToMongoose } from '@/src/lib/db';
import users from '@/src/models/Users';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

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

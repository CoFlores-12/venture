import { connectToMongoose } from '@/src/lib/db';
import users from '@/src/models/Users';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  await connectToMongoose();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: 'ID inválido.' },
      { status: 400 }
    );
  }

  try {
    const user = await users.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado.' },
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

import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import User from '@/src/models/user';

export async function GET(request, { params }) {
  try {
    await connectToMongoose();

    const { id } = params;

    //Validar si el ID es un ObjectId válido de Mongoose
    if (!id || !User.base.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario no válido.' },
        { status: 400 }
      );
    }

    //Buscar el usuario por su ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    //Retornar el perfil del usuario
    return NextResponse.json(
      {
        success: true,
        message: 'Perfil de usuario obtenido exitosamente.',
        user: user,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
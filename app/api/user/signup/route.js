import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToMongoose } from '@/src/lib/db';
import User from '@/src/models/user';


export async function POST(req) {
  try {
    await connectToMongoose();

    const body = await req.json();
    const { name, email, password } = body;

    //Validaciones simples
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    //Verificar si ya existe un usuario con ese correo
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'El correo ya está registrado.' },
        { status: 409 } // Conflicto
      );
    }

    //Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //Crear el nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      signUpMethod: 'credentials'
    });

    await newUser.save();

    //Retornar respuesta exitosa
    return NextResponse.json(
      { message: 'Usuario registrado exitosamente.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('[SIGNUP_ERROR]', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { connectToMongoose } from '@/src/lib/db';
import User from '@/src/models/user';

export async function POST(request) {
  try {
    await connectToMongoose();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

   // const user = await User.findOne({ email });
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Generar el token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || 'user',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    const userWithoutPassword = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Login exitoso',
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToMongoose } from '@/src/lib/db'; 
import users from "@/src/models/Users";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, correo, password } = body;

    if (!nombre || !correo || !password) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }
 
    await connectToMongoose();

    const existingUser = await users.findOne({ correo });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "El correo ya está registrado." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new users({
      nombre,
      correo,
      passwordHash
    });

    await nuevoUsuario.save();

    return NextResponse.json(
      { success: true, message: "Usuario registrado correctamente." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error del servidor." },
      { status: 500 }
    );
  }
}

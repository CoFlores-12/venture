import bcrypt from "bcryptjs";
import { connectToMongoose } from "./db";
import User from "../models/admin";

/**
 * Verifica las credenciales del usuario normal.
 * @param {string} correo - Correo del usuario
 * @param {string} password - Contraseña sin hashear
 * @returns {Promise<Object|null>} - Objeto del usuario o null
 */
export async function findUserByCredentials(correo, password) {
  await connectToMongoose();

  const user = await User.findOne({ correo: correo.toLowerCase() });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return {
    _id: user._id.toString(),
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol || "user",
  };
}

import bcrypt from "bcryptjs";
import { connectToMongoose } from "./db";
import Users from "../models/Users";

/**
 * Verifica las credenciales del usuario normal.
 * @param {string} correo - Correo del usuario
 * @param {string} password - Contraseña sin hashear
 * @returns {Promise<Object|null>} - Objeto del usuario o null
 */
export async function findUserByCredentials(correo, password) {
  await connectToMongoose();

  const user = await Users.findOne({ correo: correo.toLowerCase() });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return {
    _id: user._id.toString(),
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol || "default",
  };
}


export async function RegisterUser(correo, password, nombre) {
   await connectToMongoose();
  
      const existingUser = await Users.findOne({ correo });
      if (existingUser) {
        return { error: "El correo ya está registrado." };
      }
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      const nuevoUsuario = new Users({
        nombre,
        correo,
        passwordHash
      });
  
      await nuevoUsuario.save();

      return {
        _id: nuevoUsuario._id.toString(),
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol || "default",
      };
}
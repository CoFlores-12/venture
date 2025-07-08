import { connectToMongoose } from "./db";
import bcrypt from "bcryptjs";
import AdminSchema from "../models/admin";


// Centralized admin configuration
// In production, this should be moved to environment variables and database

export const ADMIN_CONFIG = {
  // Default admin credentials (should be in environment variables in production)
  DEFAULT_ADMIN: {
    id: "1",
    name: "Admin User",
    email: "admin@venture.com",
    password: "admin123", // In production, use hashed passwords
    adminCode: "VENTURE2024",
    role: "admin"
  },
  
  // Admin code for registration (should be in environment variables in production)
  ADMIN_REGISTRATION_CODE: "VENTURE2024",
  
  // Admin user schema structure
  ADMIN_SCHEMA: {
    id: "string",
    name: "string", 
    email: "string",
    password: "string",
    adminCode: "string",
    role: "admin"
  }
};


/**
 * Busca y autentica un administrador por email, password y adminCode.
 * @param {string} email
 * @param {string} password
 * @param {string} adminCode
 * @returns {Promise<Object|null>} - Admin autenticado o null
 */
export async function findAdminByCredentials(email, password, adminCode) {
  await connectToMongoose();

  const admin = await AdminSchema.findOne({ correo: email.toLowerCase() });
  if (!admin) {
    console.error('No admin found for email:', email);
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    console.error('Invalid password for admin:', email);
    return null;
  }

  const isCodeValid = await bcrypt.compare(adminCode, admin.adminCode);
  if (!isCodeValid) {
    console.error('Invalid admin code for admin:', email);
    return null;
  }

  return {
    _id: admin._id.toString(),
    nombre: admin.nombre,
    correo: admin.correo,
    rol: admin.rol || "admin",
  };
} 
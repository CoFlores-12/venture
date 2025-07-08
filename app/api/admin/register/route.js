import { NextResponse } from 'next/server';
import { ADMIN_CONFIG } from '../../../../src/lib/admin-config';
import AdminSchema from '../../../../src/models/admin';
import bcrypt from 'bcryptjs';
import { connectToMongoose } from '../../../../src/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, adminCode } = body;

    // Validate required fields
    if (!name || !email || !password || !adminCode) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Check if admin code is valid (in production, this should be more secure)
    if (adminCode !== ADMIN_CONFIG.ADMIN_REGISTRATION_CODE) {
      return NextResponse.json(
        { error: 'Código de administrador inválido' },
        { status: 400 }
      );
    }

    await connectToMongoose();

    // Check if email already exists in the database
    const existingAdmin = await AdminSchema.findOne({ correo: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Ya existe un administrador con este email' },
        { status: 400 }
      );
    }

    // Hash password and adminCode
    const passwordHash = await bcrypt.hash(password, 10);
    const adminCodeHash = await bcrypt.hash(adminCode, 10);

    // Create new admin user in the database
    const newAdminDoc = await AdminSchema.create({
      nombre: name,
      correo: email.toLowerCase(),
      passwordHash,
      adminCode: adminCodeHash,
      rol: 'admin',
    });

    return NextResponse.json(
      {
        message: 'Administrador registrado exitosamente',
        admin: {
          id: newAdminDoc._id.toString(),
          name: newAdminDoc.nombre,
          email: newAdminDoc.correo,
          role: newAdminDoc.rol,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering admin:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToMongoose();
    const admins = await AdminSchema.find({}, { passwordHash: 0, adminCode: 0 });
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
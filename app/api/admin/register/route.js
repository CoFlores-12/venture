import { NextResponse } from 'next/server';
import { 
  ADMIN_CONFIG, 
  addAdminUser, 
  findAdminByEmail, 
  getSafeAdminList 
} from '../../../lib/admin-config';

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

    // Check if email already exists
    const existingAdmin = findAdminByEmail(email);
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Ya existe un administrador con este email' },
        { status: 400 }
      );
    }

    // Create new admin user
    const newAdmin = addAdminUser({
      name,
      email,
      password, // In production, hash this password
      adminCode
    });

    return NextResponse.json(
      { 
        message: 'Administrador registrado exitosamente',
        admin: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role
        }
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
  // Return admin users (without passwords)
  return NextResponse.json(getSafeAdminList());
} 
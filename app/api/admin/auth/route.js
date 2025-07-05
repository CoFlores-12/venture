import { NextResponse } from 'next/server';
import { findAdminByCredentials } from '../../../lib/admin-config';

export async function POST(request) {
  try {
    const { email, password, adminCode } = await request.json();

    // Validate required fields
    if (!email || !password || !adminCode) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Find admin by credentials
    const admin = findAdminByCredentials(email, password, adminCode);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Create admin session (you might want to use a different session strategy)
    const adminSession = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isAdmin: true,
      loginTime: new Date().toISOString()
    };

    // Set secure HTTP-only cookie for admin session
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login exitoso',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      },
      { status: 200 }
    );

    // Set secure admin session cookie
    response.cookies.set('admin-session', JSON.stringify(adminSession), {
      httpOnly: true,
      secure: false, // Allow HTTP in development
      sameSite: 'lax', // Less restrictive for development
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/' // Allow access from all paths
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logout exitoso' },
      { status: 200 }
    );

    // Clear admin session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: false, // Allow HTTP in development
      sameSite: 'lax', // Less restrictive for development
      maxAge: 0,
      path: '/' // Allow access from all paths
    });

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
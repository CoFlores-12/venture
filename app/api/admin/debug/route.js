import { NextResponse } from 'next/server';
import AdminSchema from '../../../../src/models/admin';
import { connectToMongoose } from '../../../../src/lib/db';

export async function GET(request) {
  try {
    // Get session from cookie
    const adminSession = request.cookies.get('admin-session');
    
    if (!adminSession) {
      return NextResponse.json({
        success: false,
        error: 'No admin session found',
        session: null
      });
    }

    const sessionData = JSON.parse(adminSession.value);
    
    // Connect to database and get current admin data
    await connectToMongoose();
    const adminFromDB = await AdminSchema.findOne({ correo: sessionData.email });
    
    return NextResponse.json({
      success: true,
      session: {
        id: sessionData.id,
        name: sessionData.name,
        email: sessionData.email,
        role: sessionData.role,
        isAdmin: sessionData.isAdmin
      },
      database: adminFromDB ? {
        id: adminFromDB._id.toString(),
        name: adminFromDB.nombre,
        email: adminFromDB.correo,
        role: adminFromDB.rol
      } : null,
      isSuperAdmin: sessionData.role === 'superadmin',
      debug: {
        sessionRole: sessionData.role,
        dbRole: adminFromDB?.rol,
        rolesMatch: sessionData.role === adminFromDB?.rol
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
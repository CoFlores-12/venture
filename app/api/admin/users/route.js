import { NextResponse } from 'next/server';
import AdminSchema from '../../../../src/models/admin';
import { connectToMongoose } from '../../../../src/lib/db';
import bcrypt from 'bcryptjs';

// Simulate database storage for users
let users = [
  {
    id: 1,
    userId: "USR001",
    name: "María González",
    email: "maria.gonzalez@email.com",
    role: "organizer",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-15",
    rtn: "0801-1990-12345",
    eventsCount: 3,
    ticketsPurchased: 12,
    totalSpent: 8500
  },
  {
    id: 2,
    userId: "USR002",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    role: "organizer",
    status: "active",
    createdAt: "2024-01-08",
    lastLogin: "2024-01-14",
    rtn: "0801-1985-67890",
    eventsCount: 2,
    ticketsPurchased: 8,
    totalSpent: 3200
  },
  {
    id: 3,
    userId: "USR003",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-05",
    lastLogin: "2024-01-13",
    rtn: "0801-1992-11223",
    eventsCount: 0,
    ticketsPurchased: 15,
    totalSpent: 12500
  },
  {
    id: 4,
    userId: "USR004",
    name: "Luis Herrera",
    email: "luis.herrera@email.com",
    role: "user",
    status: "suspended",
    createdAt: "2024-01-03",
    lastLogin: "2024-01-10",
    rtn: "0801-1988-44556",
    eventsCount: 0,
    ticketsPurchased: 5,
    totalSpent: 2800
  },
  {
    id: 5,
    userId: "USR005",
    name: "Sofia Martínez",
    email: "sofia.martinez@email.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-12",
    lastLogin: "2024-01-15",
    rtn: null,
    eventsCount: 0,
    ticketsPurchased: 3,
    totalSpent: 1200
  },
  {
    id: 6,
    userId: "USR006",
    name: "Roberto Jiménez",
    email: "roberto.jimenez@email.com",
    role: "organizer",
    status: "pending",
    createdAt: "2024-01-15",
    lastLogin: null,
    rtn: "0801-1995-77889",
    eventsCount: 0,
    ticketsPurchased: 0,
    totalSpent: 0
  },
  {
    id: 7,
    userId: "USR007",
    name: "Carmen López",
    email: "carmen.lopez@email.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-07",
    lastLogin: "2024-01-14",
    rtn: "0801-1991-33445",
    eventsCount: 0,
    ticketsPurchased: 20,
    totalSpent: 18000
  },
  {
    id: 8,
    userId: "USR008",
    name: "Diego Ramírez",
    email: "diego.ramirez@email.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-09",
    lastLogin: "2024-01-15",
    rtn: null,
    eventsCount: 0,
    ticketsPurchased: 7,
    totalSpent: 4200
  }
];

// GET - Retrieve all users
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    
    let filteredUsers = users;
    
    // Filter by status if provided
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    // Filter by role if provided
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: filteredUsers.length,
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      pending: users.filter(u => u.status === 'pending').length,
      organizers: users.filter(u => u.role === 'organizer').length,
      regularUsers: users.filter(u => u.role === 'user').length
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Create new user (for admin registration)
export async function POST(request) {
  try {
    // Check session cookie for superadmin
    const adminSession = request.cookies.get('admin-session');
    if (!adminSession) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const sessionData = JSON.parse(adminSession.value);
    if (!sessionData.isAdmin || sessionData.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Solo el superadmin puede crear admins' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, adminCode, role } = body;

    if (!name || !email || !password || !adminCode) {
      return NextResponse.json(
        { success: false, error: 'Nombre, email, contraseña y código de admin son requeridos' },
        { status: 400 }
      );
    }

    await connectToMongoose();
    const existingAdmin = await AdminSchema.findOne({ correo: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un admin con este email' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const adminCodeHash = await bcrypt.hash(adminCode, 10);
    const newAdmin = await AdminSchema.create({
      nombre: name,
      correo: email.toLowerCase(),
      passwordHash,
      adminCode: adminCodeHash,
      rol: role || 'admin',
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin._id.toString(),
        name: newAdmin.nombre,
        email: newAdmin.correo,
        role: newAdmin.rol,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
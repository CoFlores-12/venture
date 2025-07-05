import { NextResponse } from 'next/server';

// Simulate database storage for users (same as main route)
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

// GET - Retrieve specific user
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const userId = parseInt(id);

    const user = users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH - Update user status or information
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const userId = parseInt(id);
    const body = await request.json();
    const { status, role, rtn } = body;

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Update user information
    const updatedUser = { ...users[userIndex] };
    
    if (status && ['active', 'suspended', 'pending'].includes(status)) {
      updatedUser.status = status;
    }
    
    if (role && ['user', 'organizer', 'admin'].includes(role)) {
      updatedUser.role = role;
    }
    
    if (rtn !== undefined) {
      updatedUser.rtn = rtn;
    }

    users[userIndex] = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const userId = parseInt(id);

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: deletedUser
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
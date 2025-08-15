import { NextResponse } from 'next/server';
import AdminSchema from '../../../../src/models/admin';
import { connectToMongoose } from '../../../../src/lib/db';
import bcrypt from 'bcryptjs';
import User from '../../../../src/models/Users';
import Purchase from '../../../../src/models/purchase';
import Event from '../../../../src/models/event';

// Helper function to format date in local timezone
function formatDateLocal(date) {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// GET - Retrieve all users
export async function GET(request) {
  try {
    await connectToMongoose();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    // Fetch users from the database
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (role && role !== 'all') {
      query.rol = role;
    }
    const dbUsers = await User.find(query).lean();

    // Calculate total spent and ticket count for each user from Purchase collection
    const userIds = dbUsers.map(user => user._id);
    const purchaseAggregation = await Purchase.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          ticketsPurchased: { $sum: '$ticketQuantity' }
        }
      }
    ]);

    // Calculate number of events created by each organizer
    const eventAggregation = await Event.aggregate([
      { $match: { organizer: { $in: userIds } } },
      {
        $group: {
          _id: '$organizer',
          eventsCount: { $sum: 1 }
        }
      }
    ]);

    // Create maps for quick lookup
    const purchaseMap = new Map();
    purchaseAggregation.forEach(item => {
      purchaseMap.set(item._id.toString(), {
        totalSpent: item.totalSpent,
        ticketsPurchased: item.ticketsPurchased
      });
    });

    const eventMap = new Map();
    eventAggregation.forEach(item => {
      eventMap.set(item._id.toString(), item.eventsCount);
    });

    // Map DB users to expected API format with real purchase and event data
    const mappedUsers = dbUsers.map((user, idx) => {
      const userId = user._id.toString();
      const purchaseData = purchaseMap.get(userId) || { totalSpent: 0, ticketsPurchased: 0 };
      const eventsCount = eventMap.get(userId) || 0;
      
      return {
        id: userId,
        userId: userId,
        name: user.nombre,
        email: user.correo,
        role: user.rol || 'user',
        status: user.status || 'active',
        createdAt: user.creadoEn,
        lastLogin: user.lastLogin,
        rtn: user.identidad || null,
        eventsCount: eventsCount,
        ticketsPurchased: purchaseData.ticketsPurchased,
        totalSpent: purchaseData.totalSpent
      };
    });

    return NextResponse.json({
      success: true,
      data: mappedUsers,
      total: mappedUsers.length,
      active: mappedUsers.filter(u => u.status === 'active').length,
      suspended: mappedUsers.filter(u => u.status === 'suspended').length,
      pending: mappedUsers.filter(u => u.status === 'pending').length,
      organizers: mappedUsers.filter(u => u.role === 'organizer').length,
      regularUsers: mappedUsers.filter(u => u.role === 'user').length
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
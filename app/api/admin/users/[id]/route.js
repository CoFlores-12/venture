import { NextResponse } from 'next/server';
import User from '../../../../../src/models/Users';
import { connectToMongoose } from '../../../../../src/lib/db';
import Purchase from '../../../../../src/models/purchase';
import Event from '../../../../../src/models/event';

// Helper function to format date in local timezone
function formatDateLocal(date) {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// GET - Retrieve specific user
export async function GET(request, { params }) {
  try {
    await connectToMongoose();
    const { id } = await params;

    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Calculate total spent and ticket count for this user
    const purchaseStats = await Purchase.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$totalAmount' },
          ticketsPurchased: { $sum: '$ticketQuantity' }
        }
      }
    ]);

    // Calculate number of events created if user is organizer
    const eventStats = await Event.aggregate([
      { $match: { organizer: user._id } },
      {
        $group: {
          _id: null,
          eventsCount: { $sum: 1 }
        }
      }
    ]);

    const userWithStats = {
      id: user._id.toString(),
      userId: user._id.toString().slice(-6).toUpperCase(),
      name: user.nombre,
      email: user.correo,
      role: user.rol || 'user',
      status: user.status || 'active',
      createdAt: user.creadoEn ? formatDateLocal(user.creadoEn) : formatDateLocal(new Date()),
      lastLogin: user.lastLogin ? formatDateLocal(user.lastLogin) : null,
      rtn: user.identidad || null,
      eventsCount: eventStats[0]?.eventsCount || 0,
      ticketsPurchased: purchaseStats[0]?.ticketsPurchased || 0,
      totalSpent: purchaseStats[0]?.totalSpent || 0
    };

    return NextResponse.json({
      success: true,
      data: userWithStats
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
    await connectToMongoose();
    const { id } = await params;
    const body = await request.json();
    const { status, role, rtn } = body;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Update user information
    const updateData = {};
    
    if (status && ['active', 'suspended', 'pending'].includes(status)) {
      updateData.status = status;
    }
    
    if (role && ['user', 'organizer', 'admin'].includes(role)) {
      updateData.rol = role;
    }
    
    if (rtn !== undefined) {
      updateData.rtn = rtn;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    // Calculate stats for response
    const purchaseStats = await Purchase.aggregate([
      { $match: { user: updatedUser._id } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$totalAmount' },
          ticketsPurchased: { $sum: '$ticketQuantity' }
        }
      }
    ]);

    const eventStats = await Event.aggregate([
      { $match: { organizer: updatedUser._id } },
      {
        $group: {
          _id: null,
          eventsCount: { $sum: 1 }
        }
      }
    ]);

    const responseUser = {
      id: updatedUser._id.toString(),
      userId: updatedUser._id.toString().slice(-6).toUpperCase(),
      name: updatedUser.nombre,
      email: updatedUser.correo,
      role: updatedUser.rol || 'user',
      status: updatedUser.status || 'active',
      createdAt: updatedUser.creadoEn ? formatDateLocal(updatedUser.creadoEn) : formatDateLocal(new Date()),
      lastLogin: updatedUser.lastLogin ? formatDateLocal(updatedUser.lastLogin) : null,
      rtn: updatedUser.identidad || null,
      eventsCount: eventStats[0]?.eventsCount || 0,
      ticketsPurchased: purchaseStats[0]?.ticketsPurchased || 0,
      totalSpent: purchaseStats[0]?.totalSpent || 0
    };

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: responseUser
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
    await connectToMongoose();
    const { id } = await params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
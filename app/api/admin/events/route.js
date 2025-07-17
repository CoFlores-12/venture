import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Event from '@/src/models/event';
import Users from '@/src/models/Users';

export async function GET() {
  try {
    await connectToMongoose();

    // Get all events with organizer information
    const events = await Event.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'organizer',
          foreignField: '_id',
          as: 'organizerInfo'
        }
      },
      {
        $unwind: {
          path: '$organizerInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          location: 1,
          date: 1,
          time: 1,
          category: 1,
          banner: 1,
          tickets: 1,
          createdAt: 1,
          organizerName: { $ifNull: ['$organizerInfo.nombre', 'Organizador Desconocido'] },
          organizerEmail: { $ifNull: ['$organizerInfo.correo', 'N/A'] },
          organizerId: '$organizerInfo._id'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      events: events || []
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching events' },
      { status: 500 }
    );
  }
} 
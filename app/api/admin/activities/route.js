import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Admin from '@/src/models/admin';

export async function GET(request) {
  try {
    await connectToMongoose();

    // Get admin ID from cookies or session
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId || adminId === 'undefined' || adminId === 'null') {
      return NextResponse.json(
        { success: false, error: 'Valid Admin ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!adminId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Admin ID format' },
        { status: 400 }
      );
    }

    // Get the last 3 activities for the specific admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    const activities = admin.activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3)
      .map(activity => ({
        action: activity.action,
        details: activity.details,
        timestamp: activity.timestamp,
        type: activity.type
      }));

    return NextResponse.json({
      success: true,
      activities: activities || []
    });

  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching activities' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToMongoose();
    const { adminId, action, details, type = 'info' } = await request.json();

    if (!adminId || !action) {
      return NextResponse.json(
        { success: false, error: 'Admin ID and action are required' },
        { status: 400 }
      );
    }

    const activity = {
      action,
      details,
      type,
      timestamp: new Date()
    };

    await Admin.findByIdAndUpdate(
      adminId,
      {
        $push: {
          activities: {
            $each: [activity],
            $slice: -50 // Keep only last 50 activities
          }
        }
      }
    );

    return NextResponse.json({
      success: true,
      activity
    });

  } catch (error) {
    console.error('Error logging admin activity:', error);
    return NextResponse.json(
      { success: false, error: 'Error logging activity' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Review from '@/src/models/review';
import Event from '@/src/models/event';
import Purchase from '@/src/models/purchase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    await connectToMongoose();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({
        canReview: false,
        reason: 'Authentication required'
      });
    }

    const { eventId } = params;
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({
        canReview: false,
        reason: 'Event not found'
      });
    }

    // Check if event has passed
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate > now) {
      return NextResponse.json({
        canReview: false,
        reason: 'Event has not yet occurred'
      });
    }

    // Check if user has purchased a ticket for this event
    const purchase = await Purchase.findOne({
      userId: session.user.id,
      eventId: eventId
    });

    if (!purchase) {
      return NextResponse.json({
        canReview: false,
        reason: 'You must purchase a ticket to review this event'
      });
    }

    // Check if user has already reviewed this event
    const existingReview = await Review.findOne({
      event: eventId,
      user: session.user.id
    });

    if (existingReview) {
      return NextResponse.json({
        canReview: false,
        reason: 'You have already reviewed this event',
        existingReview
      });
    }

    return NextResponse.json({
      canReview: true,
      reason: 'Eligible to review'
    });

  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check review eligibility' },
      { status: 500 }
    );
  }
} 
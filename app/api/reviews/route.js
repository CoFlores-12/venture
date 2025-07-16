import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Review from '@/src/models/review';
import Event from '@/src/models/event';
import User from '@/src/models/user';
import Purchase from '@/src/models/purchase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';
import { dispatchNotificationEvent } from '@/src/lib/eventDispatcher';

export async function POST(request) {
  try {
    console.log('Review POST: Starting...');
    await connectToMongoose();
    console.log('Review POST: Connected to DB');
    
    const session = await getServerSession(authOptions);
    console.log('Review POST: Session:', session ? 'Found' : 'Not found');
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { eventId, rating, comment } = await request.json();
    console.log('Review POST: Received data:', { eventId, rating, comment });
    
    // DEBUG: Log IDs and types
    console.log('Review POST: userId', session.user.id, typeof session.user.id);
    console.log('Review POST: eventId', eventId, typeof eventId);

    if (!eventId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Event ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Convert to ObjectId if they're valid strings, otherwise use as-is
    let userId = session.user.id;
    let eventObjId = eventId;
    
    try {
      if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
        userId = new mongoose.Types.ObjectId(userId);
      }
      if (typeof eventId === 'string' && mongoose.Types.ObjectId.isValid(eventId)) {
        eventObjId = new mongoose.Types.ObjectId(eventId);
      }
    } catch (error) {
      console.error('Error converting ObjectIds:', error);
    }

    console.log('Review POST: Converted IDs:', { userId, eventObjId });

    // Check if event exists
    const event = await Event.findById(eventObjId);
    console.log('Review POST: Event found:', event ? 'Yes' : 'No');
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // TEMPORARILY SKIP PURCHASE CHECK FOR TESTING
    console.log('Review POST: Skipping purchase check for testing');

    // Check if user has already reviewed this event
    const existingReview = await Review.findOne({
      event: eventObjId,
      user: userId
    });
    console.log('Review POST: Existing review found:', existingReview ? 'Yes' : 'No');

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this event' },
        { status: 409 }
      );
    }

    // Create the review
    console.log('Creating review with data:', {
      event: eventObjId,
      user: userId,
      rating,
      comment,
      userName: session.user.name,
      userEmail: session.user.email
    });

    console.log('Review model schema paths:', Object.keys(Review.schema.paths));

    const review = new Review({
      event: eventObjId,
      user: userId,
      rating,
      comment,
      userName: session.user.name,
      userEmail: session.user.email
    });

    console.log('Review object created:', review);
    await review.save();
    console.log('Review saved successfully');

    const reviewerUser = await User.findById(userId);

    // Asegurarse de que el evento tiene un organizador y que el organizador tiene un correo
    if (event.organizer && event.organizer.correo && reviewerUser) {
      console.log('Delegating review notification...');
      dispatchNotificationEvent('review_received', { 
        review: review.toObject(),
        event: event.toObject(), 
        organizer: event.organizer.toObject(), 
        reviewer: reviewerUser.toObject(), // Datos del usuario que dejó la reseña
      });
    } else {
      console.warn('Advertencia: No se pudo encontrar el organizador o su correo, o el usuario que dejó la reseña para enviar la notificación.');
    }

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting review:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You have already reviewed this event' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit review', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectToMongoose();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { eventId, rating, comment } = await request.json();
    
    if (!eventId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Event ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Convert to ObjectId
    let userId = session.user.id;
    let eventObjId = eventId;
    
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userId = new mongoose.Types.ObjectId(userId);
    }
    if (typeof eventId === 'string' && mongoose.Types.ObjectId.isValid(eventId)) {
      eventObjId = new mongoose.Types.ObjectId(eventId);
    }

    // Find and update the existing review
    const updatedReview = await Review.findOneAndUpdate(
      {
        event: eventObjId,
        user: userId
      },
      {
        rating,
        comment,
        userName: session.user.name,
        userEmail: session.user.email
      },
      {
        new: true, // Return the updated document
        runValidators: true
      }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    
    return NextResponse.json(
      { error: 'Failed to update review', details: error.message },
      { status: 500 }
    );
  }
} 
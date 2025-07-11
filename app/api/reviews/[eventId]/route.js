import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Review from '@/src/models/review';

export async function GET(request, context) {
  try {
    await connectToMongoose();
    const { eventId } = await context.params;
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ event: eventId })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Review from '@/src/models/review';

export async function GET(request, context) {
  try {
    await connectToMongoose();
    const { userId } = await context.params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ user: userId })
      .populate('event', 'title date banner')
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    return NextResponse.json({
      reviews,
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user reviews' },
      { status: 500 }
    );
  }
} 
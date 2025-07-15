import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Review from '@/src/models/review';

export async function GET(req, { params }) {
  await connectToMongoose();

  try {
    const reviews = await Review.find({ event: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Purchase from '@/src/models/purchase';

export async function GET(request, context) {
  const { userId } = await context.params;
    await connectToMongoose();

  try {
    // Find purchases for the user and populate event details
    const purchases = await Purchase.find({ user: userId }).populate('event');
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}
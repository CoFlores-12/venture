import { connectToMongoose } from '@/src/lib/db';
import PushSubscription from '@/src/models/pushSubs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const body = await req.json();
    
    const { userId, role, subscription } = body;
    
    if (!subscription) {
        return NextResponse.json({ success: false, message: 'No subscription provided' }, { status: 400 });
    }
    await connectToMongoose();

  await PushSubscription.findOneAndUpdate(
    { userId },
    { subscription },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}

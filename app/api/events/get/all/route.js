import { connectToMongoose } from '@/src/lib/db'; 
import Event from '@/src/models/event';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectToMongoose();
    const events = await Event.find({});
    return NextResponse.json(events);
}
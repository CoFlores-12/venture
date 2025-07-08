import { connectToMongoose } from '@/src/lib/db'; 
import users from '@/src/models/Users';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToMongoose();
  const usersData = await users.find({});
  return NextResponse.json(usersData);
}


import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Purchase from '@/src/models/purchase';
import Event from '@/src/models/event';

export async function GET(request, context) {
  const { organizerId } = await context.params;
  await connectToMongoose();

  try {
    // First, find all events owned by this organizer
    const organizerEvents = await Event.find({ organizer: organizerId }).select('_id');
    const eventIds = organizerEvents.map(event => event._id);

    // Then find all purchases for those events
  const purchases = await Purchase.find({
  event: { $in: eventIds }
})
.populate('event')
.populate('user', 'name email')
.lean();

const purchasesWithCommission = purchases.map(p => ({
  ...p,
  totalAmount: p.totalAmount - (p.totalAmount * 0.10)
}));

    return NextResponse.json(purchasesWithCommission);
  } catch (error) {
    console.error('Error fetching organizer purchases:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

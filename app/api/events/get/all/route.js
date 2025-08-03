import { connectToMongoose } from '@/src/lib/db'; 
import Event from '@/src/models/event';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectToMongoose();
    
    // Get all events
    const allEvents = await Event.find({});
    
    // Filter to only include active events (future events)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    const activeEvents = allEvents.filter(event => {
        let eventDate;
        
        // Parse event date properly
        if (event.date && typeof event.date === 'string' && event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = event.date.split('-').map(Number);
            eventDate = new Date(year, month - 1, day);
        } else {
            eventDate = new Date(event.date);
        }
        
        // Return events that are today or in the future
        return eventDate >= currentDate;
    });
    
    return NextResponse.json(activeEvents);
}
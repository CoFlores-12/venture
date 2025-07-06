import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantityAvailable: { type: Number, required: false }, // optional
});

const OrganizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profile: { type: String, required: true },
  rating: { type: Number, required: true },
  eventsOrganized: { type: Number, required: true },
  avatar: { type: String, required: true },
});

const EventSchema = new mongoose.Schema({
  featured: { type: Boolean, default: false },
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  distance: { type: String },
  category: { type: String, required: true },
  emoji: { type: String, required: true },
  position: {
    type: [Number], 
    required: true,
  },
  description: { type: String, required: true },
  tickets: [TicketSchema],
  ticketsAvailable: { type: Number, required: true },
  organizer: { type: OrganizerSchema, required: true },
  banner: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);

import mongoose from "mongoose";
import { Schema, model, models } from 'mongoose';

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantityAvailable: { type: Number, required: false },
  quantity: {type: Number}
});

const EventSchema = new mongoose.Schema({
  featured: { type: Boolean, default: false },
  title: { type: String, required: true },
  plan: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  category: { type: String, required: true },
  position: {
    type: [Number], 
    required: true,
  },
  description: { type: String, required: true },
  tickets: [TicketSchema],
  organizer:  {type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,},
  banner: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);

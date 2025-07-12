import { Schema, model, models } from 'mongoose';

const purchaseSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticketQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  typeTicket: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
}, {
  timestamps: true,
});

const Purchase = models.Purchase || model('Purchase', purchaseSchema);
export default Purchase;

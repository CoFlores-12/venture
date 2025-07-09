import mongoose from 'mongoose';

const PushSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscription: Object,
}, { timestamps: true });

export default mongoose.models.PushSubscription || mongoose.model('PushSubscription', PushSubscriptionSchema);

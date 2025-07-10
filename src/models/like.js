
import { Schema, model, models } from "mongoose";

const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  targetType: {
    type: String,
    enum: ["event", "user"],
    required: true,
  },
}, {
  timestamps: true,
});

likeSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

const Like = models.Like || model("Like", likeSchema);
export default Like;    
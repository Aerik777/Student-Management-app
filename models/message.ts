import mongoose, { Schema, Document } from 'mongoose';

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default (mongoose.models.Message as any) ||
  mongoose.model('Message', MessageSchema);

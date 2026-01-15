import mongoose, { Schema } from 'mongoose';

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true },

  isFeesPaid: { type: Boolean, default: false },
});

export default (mongoose.models.Student as any) ||
  mongoose.model('Student', StudentSchema);

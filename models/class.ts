import mongoose, { Schema, model, models } from 'mongoose';

const ClassSchema = new Schema(
  {
    grade: {
      type: String,
      required: [true, 'Please provide a grade/class name'],
      unique: true,
    },
  },
  { timestamps: true }
);

const Class = (models.Class as any) || model('Class', ClassSchema);

export default Class;

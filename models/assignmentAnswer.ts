import mongoose, { Schema, model, models } from 'mongoose';

const AssignmentAnswerSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questioneid: {
      type: Schema.Types.ObjectId,
      ref: 'AssignmentQuestion',
      required: true,
    },
    file: {
      type: String, // PDF URL
      required: true,
    },
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'pending', 'not submitted'],
      default: 'pending',
    },
    remarks: {
      type: String, // Feedback from teacher
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const AssignmentAnswer =
  (models.AssignmentAnswer as any) ||
  model('AssignmentAnswer', AssignmentAnswerSchema);

export default AssignmentAnswer;

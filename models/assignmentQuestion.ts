import mongoose, { Schema, model, models } from 'mongoose';

const AssignmentQuestionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assigned_class_id: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    submission_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const AssignmentQuestion =
  (models.AssignmentQuestion as any) ||
  model('AssignmentQuestion', AssignmentQuestionSchema);

export default AssignmentQuestion;

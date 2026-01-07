import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
  title: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  credits: { type: Number, required: true },
  instructor: { type: String, required: true },
  // Linking back to the Student model
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
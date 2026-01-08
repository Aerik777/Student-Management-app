import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: false, // Optional for flexibility
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      default: 'Absent',
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for the same student in the same course on the same day
// AttendanceSchema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;

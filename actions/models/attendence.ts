import mongoose, { Schema } from 'mongoose';

const AttendanceSchema = new Schema({
  // Link to the specific student
  studentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  // Link to the specific course (optional, but recommended for school apps)
  courseId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    default: 'Absent'
  },
  remarks: { 
    type: String 
  }
}, { timestamps: true });

// Prevent duplicate attendance for the same student in the same course on the same day
AttendanceSchema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
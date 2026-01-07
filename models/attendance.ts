// models/Attendance.ts
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  subject: { type: String } // Optional: track by subject
});

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
import mongoose, { Schema } from 'mongoose';

// 1. Book Inventory
const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
});

// 2. Issuance Record
const IssueSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date }, // Null if not returned yet
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
});

export const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);
export const Issue = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);
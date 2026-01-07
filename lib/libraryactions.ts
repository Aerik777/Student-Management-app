'use server';

import { connectDB } from "./db";
import { Book, Issue } from "@/models/Library";
import { revalidatePath } from "next/cache";

export async function issueBook(bookId: string, studentId: string) {
  await connectDB();

  const book = await Book.findById(bookId);
  if (!book || book.availableCopies < 1) {
    throw new Error("Book not available");
  }

  // 1. Create Issue Record
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

  await Issue.create({ bookId, studentId, dueDate });

  // 2. Update Inventory
  book.availableCopies -= 1;
  await book.save();

  revalidatePath('/admin/library');
}
import nodemailer from 'nodemailer';
import { Issue } from '@/models/library';
import Student from '@/models/student';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an "App Password" for Gmail
  },
});

export const sendReminderEmail = async (
  to: string,
  studentName: string,
  bookTitle: string
) => {
  await transporter.sendMail({
    from: '"College Library" <library@college.edu>',
    to,
    subject: '📚 Reminder: Book Due Tomorrow',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Hello, ${studentName}</h2>
        <p>This is a friendly reminder that the book <strong>"${bookTitle}"</strong> is due back at the library tomorrow.</p>
        <p>Please return it on time to avoid late fees.</p>
        <br />
        <p>Regards,<br />College Library Team</p>
      </div>
    `,
  });
};

export async function checkAndSendReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  // Find issues due tomorrow
  const issues = await Issue.find({
    dueDate: { $gte: tomorrow, $lt: dayAfterTomorrow },
    status: 'Issued',
  })
    .populate('studentId')
    .populate('bookId');

  for (const issue of issues) {
    const student = issue.studentId;
    const book = issue.bookId;
    if (student && student.email) {
      await sendReminderEmail(student.email, student.name, book.title);
    }
  }
}

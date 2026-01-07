import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an "App Password" for Gmail
  },
});

export const sendReminderEmail = async (to: string, studentName: string, bookTitle: string) => {
  await transporter.sendMail({
    from: '"College Library" <library@college.edu>',
    to,
    subject: "📚 Reminder: Book Due Tomorrow",
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
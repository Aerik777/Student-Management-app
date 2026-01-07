import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db'; // Your DB connection helper
import StudentSchema from '@/models/student';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Fetch a user by email or ID from query string
        const { email } = req.query;
        const student = await Student.findOne({ email }).populate('courses');
        
        if (!student) {
          return res.status(404).json({ success: false, message: 'Student not found' });
        }
        return res.status(200).json({ success: true, data: student });
      } catch (error) {
        return res.status(400).json({ success: false });
      }

    case 'POST':
      try {
        // Create a new student record
        const student = await Student.create(req.body);
        return res.status(201).json({ success: true, data: student });
      } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
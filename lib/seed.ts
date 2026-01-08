import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/user';

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if an admin already exists to avoid duplicates
    const existingAdmin = await User.findOne({ role: 'ADMIN' });
    if (existingAdmin) {
      console.log('Admin already exists. Skipping seed.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);

    await User.create({
      name: 'Super Admin',
      email: 'admin@college.com',
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@college.com | Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();

import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false, // Prevents password from being sent in API responses by default
    },
    role: {
      type: String,
      enum: ['ADMIN', 'TEACHER', 'STUDENT'],
      default: 'STUDENT',
    },
    profileImage: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);

// This check prevents Mongoose from creating the model multiple times during Next.js Hot Reloads
const User = (models.User as any) || model('User', UserSchema);
export type UserType = mongoose.InferSchemaType<typeof UserSchema>;

export default User;

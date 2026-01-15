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
      enum: ['ADMIN', 'FACULTY', 'STUDENT'],
      default: 'STUDENT',
      uppercase: true,
      trim: true,
    },
    rollNumber: {
      type: String,
    },

    qualification: {
      type: String,
    },
    contact_no: {
      type: Number,
    },
    address: {
      type: String,
    },
    classIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    admitted_at: {
      type: Date,
      default: Date.now,
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
// We also force a re-registration if the existing model is missing the 'FACULTY' role
if (
  models.User &&
  models.User.schema.path('role') &&
  !models.User.schema.path('role').options.enum.includes('FACULTY')
) {
  delete (models as any).User;
}

const User = (models.User as any) || model('User', UserSchema);
export type UserType = mongoose.InferSchemaType<typeof UserSchema>;

export default User;

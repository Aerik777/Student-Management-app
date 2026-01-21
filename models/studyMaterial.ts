import mongoose, { Schema, model, models } from 'mongoose';

const StudyMaterialSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
        },
        description: {
            type: String,
        },
        fileUrl: {
            type: String, // PDF URL
            required: true,
        },
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
    },
    { timestamps: true }
);

const StudyMaterial =
    (models.StudyMaterial as any) ||
    model('StudyMaterial', StudyMaterialSchema);

export default StudyMaterial;

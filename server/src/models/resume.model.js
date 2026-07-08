import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema(
  {
    full_name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    profession: { type: String, default: '' },
    image: { type: String, default: '' }, // URL to uploaded image
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  start_date: String,
  end_date: String,
  description: String,
  is_current: { type: Boolean, default: false },
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  graduation_date: String,
  gpa: String,
});

const projectSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      default: 'Untitled Resume',
    },
    public: { type: Boolean, default: false },
    template: {
      type: String,
      enum: ['classic', 'modern', 'minimal', 'minimal-image', 'professional', 'ats', 'elegant'],
      default: 'classic',
    },
    accent_color: { type: String, default: '#3B82F6' },

    personal_info: { type: personalInfoSchema, default: () => ({}) },
    professional_summary: { type: String, default: '' },
    skills: { type: [String], default: [] },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    project: { type: [projectSchema], default: [] },
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },

    // Original file kept when a user uploads an existing resume.
    sourceFile: { type: String, default: null },
  },
  { timestamps: true }
);

resumeSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Resume = mongoose.model('Resume', resumeSchema);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { JobRole } from '../models/Interview.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_interview_db');

  const roles = [
    {
      title: 'Software Engineer',
      description: 'Build and maintain backend/frontend systems.',
      requiredSkills: ['JavaScript', 'Node.js', 'MongoDB', 'REST APIs'],
      preferredSkills: ['TypeScript', 'AWS', 'Docker'],
      experienceLevel: 'mid',
      difficultyScore: 7,
    },
    {
      title: 'Frontend Developer',
      description: 'Create scalable user interfaces.',
      requiredSkills: ['React', 'CSS', 'JavaScript'],
      preferredSkills: ['TypeScript', 'TailwindCSS'],
      experienceLevel: 'mid',
      difficultyScore: 6,
    },
    {
      title: 'Data Analyst',
      description: 'Analyze data and create insights.',
      requiredSkills: ['SQL', 'Python', 'Data Visualization'],
      preferredSkills: ['Statistics', 'Excel'],
      experienceLevel: 'entry',
      difficultyScore: 5,
    },
  ];

  for (const role of roles) {
    await JobRole.findOneAndUpdate(
      { title: role.title },
      role,
      { upsert: true, new: true }
    );
  }

  console.log('Job roles seeded');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

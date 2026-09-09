import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { extractSkillsFromResume } from '../services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads/resumes');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf' && !file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(new Error('Only PDF files are allowed'));
    return;
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

export const createResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    const filePath = path.join(uploadDir, req.file.filename);
    const fileData = fs.readFileSync(filePath);
    const pdfData = await PDFParse(fileData);

    let extractedData = {};

    try {
      extractedData = await extractSkillsFromResume(pdfData.text);
    } catch (aiError) {
      console.warn('Resume AI extraction failed:', aiError.message);
    }

    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        fileUrl: `/uploads/resumes/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        rawText: pdfData.text,
        parsedAt: new Date(),
        extractedSkills: extractedData.technical_skills || [],
        extractedExperience: {
          years: extractedData.years_of_experience || 0,
          summary: extractedData.experience_summary || '',
          titles: extractedData.job_titles || [],
        },
        extractedEducation: extractedData.education || [],
        extractedCertifications: extractedData.certifications || [],
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Resume uploaded successfully', resume });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }

    res.json(resume);
  } catch (error) {
    next(error);
  }
};

export const extractText = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const fileData = fs.readFileSync(req.file.path);
    const pdfData = await PDFParse(fileData);

    res.json({ text: pdfData.text, length: pdfData.text.length, pages: pdfData.numpages || 0 });
  } catch (error) {
    next(error);
  }
};

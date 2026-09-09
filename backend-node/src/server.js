import './config/dotenv.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'express-node-backend' });
});

app.use('/api/users', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

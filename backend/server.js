const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const aiRoutes = require('./routes/ai.routes');
const contentRoutes = require('./routes/content.routes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/teacher/content', contentRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LearnMate AI Backend Running smoothly 🚀' });
});

// Friendly error handling middleware (PRD Rule 43)
app.use((err, req, res, next) => {
  console.error('[Server Error Trace]:', err.stack);
  res.status(500).json({
    message: 'Oops! Something went wrong on our end. Please try again.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5050;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[LearnMate AI Server] running on port ${PORT}`);
  });
}

module.exports = app;
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Lesson = require('../models/Lesson');

// @route POST /api/teacher/content/lesson
router.post('/lesson', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { subjectName, chapterNumber, chapterTitle, title, summary, content, keyConcepts, videoUrl, pdfUrl, quiz } = req.body;
    const lesson = await Lesson.create({
      subjectName,
      chapterNumber: chapterNumber || 1,
      chapterTitle,
      title,
      summary,
      content,
      keyConcepts: keyConcepts || [],
      videoUrl,
      pdfUrl,
      quiz: quiz || []
    });
    res.status(201).json({ message: 'Lesson published successfully! 📚', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/teacher/content/lessons
router.get('/lessons', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

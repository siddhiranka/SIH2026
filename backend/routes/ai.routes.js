const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { askAITutor, askTeacherAssistant, generateTeacherContent, generateTeacherAssignment, generateQuiz } = require('../services/ai.service');

// @route POST /api/ai/ask
router.post('/ask', protect, async (req, res) => {
  try {
    const { question, subject, grade, lessonContext, preferredLanguage } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question string is required' });
    }
    const answer = await askAITutor({
      question,
      subject,
      grade,
      lessonContext,
      preferredLanguage: preferredLanguage || 'English'
    });
    res.json({ answer, subject: subject || 'General' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/ai/teacher-assistant
router.post('/teacher-assistant', protect, async (req, res) => {
  try {
    const { question, classContext, preferredLanguage } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    const response = await askTeacherAssistant({
      question,
      classContext,
      preferredLanguage: preferredLanguage || 'English'
    });
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/ai/generate-content
router.post('/generate-content', protect, async (req, res) => {
  try {
    const { topic, subject, grade, preferredLanguage } = req.body;
    const content = await generateTeacherContent({
      topic: topic || 'Lesson Topic',
      subject: subject || 'General',
      grade: grade || '7',
      preferredLanguage: preferredLanguage || 'English'
    });
    res.json({ content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/ai/generate-assignment
router.post('/generate-assignment', protect, async (req, res) => {
  try {
    const { topic, subject, grade, count, preferredLanguage } = req.body;
    const content = await generateTeacherAssignment({
      topic: topic || 'Assignment Topic',
      subject: subject || 'General',
      grade: grade || '7',
      count: count || 5,
      preferredLanguage: preferredLanguage || 'English'
    });
    res.json({ content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/ai/generate-quiz
router.post('/generate-quiz', protect, async (req, res) => {
  try {
    const { topic, subject, count, preferredLanguage } = req.body;
    const questions = await generateQuiz({
      topic: topic || 'General Topic',
      subject: subject || 'Mathematics',
      count: count || 5,
      preferredLanguage: preferredLanguage || 'English'
    });
    res.json({ topic, subject, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/translate', protect, async (req, res) => { try { const { content, targetLanguage } = req.body; if (!content || !targetLanguage) return res.status(400).json({message: 'Content and target language required'}); const translated = await require('../services/ai.service').translateContent(content, targetLanguage); res.json({ translatedContent: translated }); } catch (err) { res.status(500).json({ message: err.message }); } });
module.exports = router;

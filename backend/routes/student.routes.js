const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Content = require('../models/Content');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');

// Student Dashboard Overview
router.get('/dashboard', protect, async (req, res) => {
  try {
    const student = req.user;
    let assignments = [];
    let quizzes = [];
    if (student.classId) {
      assignments = await Assignment.find({ classId: student.classId, status: 'published' }).sort({ createdAt: -1 }).limit(3);
      quizzes = await Quiz.find({ classId: student.classId, status: 'published' }).sort({ createdAt: -1 }).limit(3);
    }
    if (assignments.length === 0) {
      assignments = await Assignment.find({ status: 'published' }).sort({ createdAt: -1 }).limit(3);
    }
    if (quizzes.length === 0) {
      quizzes = await Quiz.find({ status: 'published' }).sort({ createdAt: -1 }).limit(3);
    }
    
    res.json({
      student: {
        name: student.name,
        learningPoints: student.learningPoints || 0,
        streak: student.streak || 0,
        badges: student.badges || [],
        className: student.className || ''
      },
      upcomingAssignments: assignments,
      upcomingQuizzes: quizzes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get published content for student's class
router.get('/content', protect, async (req, res) => {
  try {
    let publishedContent = [];
    if (req.user.classId) {
      publishedContent = await Content.find({ classId: req.user.classId, status: 'published' }).sort({ createdAt: -1 });
    }
    if (publishedContent.length === 0) {
      publishedContent = await Content.find({ status: 'published' }).sort({ createdAt: -1 });
    }
    res.json(publishedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/content/:id', protect, async (req, res) => {
  try {
    const item = await Content.findOne({ _id: req.params.id, status: 'published' });
    if (!item) return res.status(404).json({ message: 'Content not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get published assignments for student's class with student's submission status
router.get('/assignments', protect, async (req, res) => {
  try {
    let assignments = [];
    if (req.user.classId) {
      assignments = await Assignment.find({ classId: req.user.classId, status: 'published' }).sort({ createdAt: -1 });
    }
    if (assignments.length === 0) {
      assignments = await Assignment.find({ status: 'published' }).sort({ createdAt: -1 });
    }
    const submissions = await Submission.find({ studentId: req.user._id });
    
    const result = assignments.map(a => {
      const sub = submissions.find(s => s.assignmentId.toString() === a._id.toString());
      return {
        ...a.toObject(),
        submission: sub || null
      };
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student submits an assignment
router.post('/assignments/:id/submit', protect, async (req, res) => {
  try {
    const { textAnswer, fileUrl, audioUrl } = req.body;
    const assignment = await Assignment.findOne({ _id: req.params.id, status: 'published' });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    let submission = await Submission.findOne({ assignmentId: req.params.id, studentId: req.user._id });
    if (submission) {
      submission.textAnswer = textAnswer || submission.textAnswer;
      submission.fileUrl = fileUrl || submission.fileUrl;
      submission.audioUrl = audioUrl || submission.audioUrl;
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      submission = await Submission.create({
        assignmentId: req.params.id,
        studentId: req.user._id,
        studentName: req.user.name,
        textAnswer: textAnswer || '',
        fileUrl: fileUrl || '',
        audioUrl: audioUrl || '',
        status: 'Submitted'
      });
      // Increment points for completing assignment
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { learningPoints: 15 }
      });
    }

    res.status(201).json({ message: 'Assignment submitted successfully!', submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unique subjects for student's class (aggregating content and quizzes)
router.get('/subjects', protect, async (req, res) => {
  try {
    let content = [];
    let quizzes = [];
    if (req.user.classId) {
      [content, quizzes] = await Promise.all([
        Content.find({ classId: req.user.classId, status: 'published' }),
        Quiz.find({ classId: req.user.classId, status: 'published' })
      ]);
    }
    if (content.length === 0 && quizzes.length === 0) {
      [content, quizzes] = await Promise.all([
        Content.find({ status: 'published' }),
        Quiz.find({ status: 'published' })
      ]);
    }
    
    const subjectMap = {};
    const icons = { 'Mathematics': '📐', 'Science': '🔬', 'English': '📖', 'Social Science': '🌍' };
    const colors = { 'Mathematics': '#6C4DF6', 'Science': '#4DB8FF', 'English': '#FFD84D', 'Social Science': '#5BCB93' };
    
    content.forEach(c => {
      if (!subjectMap[c.subject]) {
        subjectMap[c.subject] = {
          _id: c.subject,
          name: c.subject,
          icon: icons[c.subject] || '📚',
          color: colors[c.subject] || '#6C4DF6',
          code: c.subject.substring(0, 4).toUpperCase() + '-7',
          description: `Lessons and content for ${c.subject}`,
          count: 0
        };
      }
      subjectMap[c.subject].count++;
    });

    quizzes.forEach(q => {
      if (!subjectMap[q.subject]) {
        subjectMap[q.subject] = {
          _id: q.subject,
          name: q.subject,
          icon: icons[q.subject] || '📚',
          color: colors[q.subject] || '#6C4DF6',
          code: q.subject.substring(0, 4).toUpperCase() + '-7',
          description: `Lessons and quizzes for ${q.subject}`,
          count: 0
        };
      }
      subjectMap[q.subject].count++;
    });
    
    res.json(Object.values(subjectMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return published content formatted as lessons for student's class
router.get('/lessons', protect, async (req, res) => {
  try {
    let content = [];
    if (req.user.classId) {
      content = await Content.find({ classId: req.user.classId, status: 'published' }).sort({ createdAt: -1 });
    }
    if (content.length === 0) {
      content = await Content.find({ status: 'published' }).sort({ createdAt: -1 });
    }
    const lessons = content.map((c, i) => ({
      _id: c._id,
      type: 'lesson',
      contentType: c.type,
      subjectName: c.subject,
      chapterNumber: i + 1,
      chapterTitle: c.subject,
      title: c.title,
      summary: c.description || 'Published by your teacher',
      content: c.content,
      fileUrl: c.fileUrl || '',
      link: c.link || '',
      videoUrl: c.videoUrl || c.link || '',
      keyConcepts: [],
      quiz: []
    }));
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single lesson by content ID
router.get('/lessons/:id', protect, async (req, res) => {
  try {
    const c = await Content.findOne({ _id: req.params.id, status: 'published' });
    if (!c) return res.status(404).json({ message: 'Lesson not found' });
    res.json({
      _id: c._id,
      subjectName: c.subject,
      chapterNumber: 1,
      chapterTitle: c.subject,
      title: c.title,
      summary: c.description || '',
      content: c.content,
      fileUrl: c.fileUrl || '',
      link: c.link || '',
      videoUrl: c.link || '',
      keyConcepts: [],
      quiz: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== STUDENT QUIZZES ====================

// Get published quizzes for student's class
router.get('/quizzes', protect, async (req, res) => {
  try {
    let quizzes = [];
    if (req.user.classId) {
      quizzes = await Quiz.find({ classId: req.user.classId, status: 'published' }).sort({ createdAt: -1 });
    }
    if (quizzes.length === 0) {
      quizzes = await Quiz.find({ status: 'published' }).sort({ createdAt: -1 });
    }
    // Also attach student's past attempts count or latest attempt
    const attempts = await QuizAttempt.find({ studentId: req.user._id });
    
    const result = quizzes.map(q => {
      const qAttempts = attempts.filter(a => a.quizId.toString() === q._id.toString());
      const latestAttempt = qAttempts.length > 0 ? qAttempts[qAttempts.length - 1] : null;
      return {
        ...q.toObject(),
        attemptCount: qAttempts.length,
        latestAttempt
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single quiz details for student to attend
router.get('/quizzes/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, status: 'published' });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Return questions WITHOUT exposing correctAnswerIndex to avoid client inspect cheating
    const sanitizedQuestions = quiz.questions.map((q, idx) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks || 1
    }));

    res.json({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      className: quiz.className,
      totalMarks: quiz.totalMarks,
      timeLimitMinutes: quiz.timeLimitMinutes,
      questions: sanitizedQuestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a quiz attempt and calculate score
router.post('/quizzes/:id/attempt', protect, async (req, res) => {
  try {
    const { answers } = req.body; // array of { questionIndex, selectedOptionIndex }
    const quiz = await Quiz.findOne({ _id: req.params.id, status: 'published' });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    const evaluatedAnswers = (answers || []).map(ans => {
      const q = quiz.questions[ans.questionIndex];
      const isCorrect = q && q.correctAnswerIndex === ans.selectedOptionIndex;
      if (isCorrect) {
        score += (q.marks || 1);
      }
      return {
        questionIndex: ans.questionIndex,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect: !!isCorrect
      };
    });

    const totalMarks = quiz.totalMarks || quiz.questions.length;
    const percentage = totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(1)) : 0;

    const previousAttemptsCount = await QuizAttempt.countDocuments({ quizId: quiz._id, studentId: req.user._id });

    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      studentId: req.user._id,
      studentName: req.user.name,
      classId: req.user.classId,
      answers: evaluatedAnswers,
      score,
      totalMarks,
      percentage,
      attemptNumber: previousAttemptsCount + 1,
      submittedAt: new Date()
    });

    // Reward points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { learningPoints: score * 5 + 10 }
    });

    res.status(201).json({
      message: 'Quiz submitted successfully!',
      attempt: {
        score,
        totalMarks,
        percentage,
        attemptNumber: attempt.attemptNumber,
        submittedAt: attempt.submittedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student's full quiz history
router.get('/quiz-history', protect, async (req, res) => {
  try {
    const history = await QuizAttempt.find({ studentId: req.user._id }).sort({ submittedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student's full real progress
router.get('/progress', protect, async (req, res) => {
  try {
    const studentId = req.user._id;
    const attempts = await QuizAttempt.find({ studentId });
    const submissions = await Submission.find({ studentId });

    const totalQuizzes = attempts.length;
    const averageScore = totalQuizzes > 0 
      ? Number((attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes).toFixed(1))
      : 0;

    res.json({
      learningPoints: req.user.learningPoints || 0,
      streak: req.user.streak || 0,
      totalQuizzesAttempted: totalQuizzes,
      averageQuizScore: averageScore,
      assignmentsSubmitted: submissions.length,
      recentQuizAttempts: attempts.slice(0, 5),
      recentSubmissions: submissions.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student update class code
router.post('/update-class', protect, async (req, res) => {
  try {
    const { classCode } = req.body;
    const Class = require('../models/Class');
    
    const classDoc = await Class.findOne({ classCode: classCode.trim().toUpperCase() });
    if (!classDoc) {
      return res.status(400).json({ message: 'Invalid class code. Please check with your teacher.' });
    }
    
    if (req.user.classId) {
      await Class.updateOne({ _id: req.user.classId }, { $pull: { students: req.user._id } });
    }
    
    await Class.updateOne({ _id: classDoc._id }, { $addToSet: { students: req.user._id } });
    
    req.user.classId = classDoc._id;
    req.user.className = classDoc.className;
    await req.user.save();
    
    res.json({ message: `Joined ${classDoc.className} successfully!`, className: classDoc.className });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

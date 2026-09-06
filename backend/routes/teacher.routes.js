const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const User = require('../models/User');
const Class = require('../models/Class');
const Content = require('../models/Content');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// ==================== TEACHER CLASSES MANAGEMENT ====================

router.get('/classes', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const classes = await Class.find({ teacherId: req.user._id }).populate('students', 'name email studentId');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/classes', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { className, subjectName, grade } = req.body;
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newClass = await Class.create({
      className,
      classCode,
      subjectName: subjectName || 'General',
      grade: grade || '7',
      teacherId: req.user._id,
      students: []
    });
    
    res.status(201).json({ message: 'Class created successfully!', class: newClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== TEACHER CONTENT MANAGEMENT ====================

router.get('/content', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const filter = { teacherId: req.user._id };
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    
    const items = await Content.find(filter).populate('classId', 'className classCode').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/content', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, subject, classId, type, content, fileUrl, externalUrl, status } = req.body;
    
    let resolvedClassId = classId;
    let className = '';
    if (classId) {
      const cls = await Class.findById(classId);
      if (cls) className = cls.className;
    } else {
      const firstClass = await Class.findOne({ teacherId: req.user._id });
      if (firstClass) {
        resolvedClassId = firstClass._id;
        className = firstClass.className;
      }
    }

    const newContent = await Content.create({
      title,
      description,
      subject: subject || 'Mathematics',
      classId: resolvedClassId,
      className,
      teacherId: req.user._id,
      type: type || 'text',
      content: content || '',
      fileUrl: fileUrl || '',
      link: externalUrl || '',
      status: status || 'draft'
    });

    res.status(201).json({
      message: newContent.status === 'published' ? 'Content published to students!' : 'Content saved as draft!',
      item: newContent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/content/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    await Content.findOneAndDelete({ _id: req.params.id, teacherId: req.user._id });
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/content/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const updated = await Content.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      req.body,
      { new: true }
    );
    res.json({ message: 'Content updated successfully', item: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/content/:id/publish', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const updated = await Content.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      { status: 'published' },
      { new: true }
    );
    res.json({ message: 'Content published to students!', item: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== TEACHER ASSIGNMENT MANAGEMENT ====================

router.get('/assignments', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user._id }).populate('classId', 'className classCode').sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/assignments', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, subject, classId, dueDate, totalPoints, attachments, links, questions, status } = req.body;

    let resolvedClassId = classId;
    if (!resolvedClassId) {
      const firstClass = await Class.findOne({ teacherId: req.user._id });
      if (firstClass) resolvedClassId = firstClass._id;
    }

    const newAssign = await Assignment.create({
      title,
      description,
      subject: subject || 'Mathematics',
      classId: resolvedClassId,
      teacherId: req.user._id,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalPoints: totalPoints || 10,
      attachments: attachments || [],
      links: links || [],
      questions: questions || [],
      status: status || 'draft'
    });

    res.status(201).json({
      message: newAssign.status === 'published' ? 'Assignment published to class!' : 'Assignment saved as draft!',
      assignment: newAssign
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/assignments/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const updated = await Assignment.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      req.body,
      { new: true }
    );
    res.json({ message: 'Assignment updated successfully', assignment: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/assignments/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    await Assignment.findOneAndDelete({ _id: req.params.id, teacherId: req.user._id });
    await Submission.deleteMany({ assignmentId: req.params.id });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/assignments/:id/publish', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const updated = await Assignment.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      { status: 'published' },
      { new: true }
    );
    res.json({ message: 'Assignment published to class!', assignment: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== TEACHER SUBMISSIONS & GRADING ====================

router.get('/submissions', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const teacherAssignments = await Assignment.find({ teacherId: req.user._id }).select('_id');
    const assignmentIds = teacherAssignments.map(a => a._id);
    const submissions = await Submission.find({ assignmentId: { $in: assignmentIds } })
      .populate('assignmentId', 'title subject dueDate totalPoints')
      .populate('studentId', 'name email studentId')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/submissions/:id/grade', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    
    submission.score = Number(score);
    submission.feedback = feedback || '';
    submission.status = 'Graded';
    await submission.save();

    // Reward student with learning points
    await User.findByIdAndUpdate(submission.studentId, {
      $inc: { learningPoints: 20 }
    });

    res.json({ message: 'Submission graded successfully!', submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== TEACHER QUIZ MANAGEMENT ====================

router.get('/quizzes', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.user._id }).populate('classId', 'className classCode').sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quizzes', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, subject, classId, questions, timeLimitMinutes, status } = req.body;
    
    let resolvedClassId = classId;
    let className = '';
    if (classId) {
      const cls = await Class.findById(classId);
      if (cls) className = cls.className;
    } else {
      const firstClass = await Class.findOne({ teacherId: req.user._id });
      if (firstClass) {
        resolvedClassId = firstClass._id;
        className = firstClass.className;
      }
    }

    const calculatedTotalMarks = (questions || []).reduce((sum, q) => sum + (Number(q.marks) || 1), 0);

    const newQuiz = await Quiz.create({
      title,
      description: description || '',
      subject: subject || 'Mathematics',
      classId: resolvedClassId,
      className,
      teacherId: req.user._id,
      questions: questions || [],
      totalMarks: calculatedTotalMarks,
      timeLimitMinutes: timeLimitMinutes || 15,
      status: status || 'draft'
    });

    res.status(201).json({
      message: newQuiz.status === 'published' ? 'Quiz published to class!' : 'Quiz saved as draft!',
      quiz: newQuiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/quizzes/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.questions) {
      updateData.totalMarks = req.body.questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
    }
    const updated = await Quiz.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      updateData,
      { new: true }
    );
    res.json({ message: 'Quiz updated successfully', quiz: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/quizzes/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    await Quiz.findOneAndDelete({ _id: req.params.id, teacherId: req.user._id });
    await QuizAttempt.deleteMany({ quizId: req.params.id });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quizzes/:id/publish', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const updated = await Quiz.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      { status: 'published' },
      { new: true }
    );
    res.json({ message: 'Quiz published to students!', quiz: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Teacher views all student attempts and results for a specific quiz
router.get('/quizzes/:id/results', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, teacherId: req.user._id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const attempts = await QuizAttempt.find({ quizId: req.params.id })
      .populate('studentId', 'name email studentId')
      .sort({ submittedAt: -1 });

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? Number((attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts).toFixed(1))
      : 0;
    const averagePercentage = totalAttempts > 0
      ? Number((attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts).toFixed(1))
      : 0;

    res.json({
      quiz,
      attempts,
      stats: {
        totalAttempts,
        averageScore,
        averagePercentage,
        totalMarks: quiz.totalMarks
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Teacher overall quiz history / all student quiz attempts
router.get('/quiz-history', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const teacherQuizzes = await Quiz.find({ teacherId: req.user._id }).select('_id');
    const quizIds = teacherQuizzes.map(q => q._id);
    const attempts = await QuizAttempt.find({ quizId: { $in: quizIds } })
      .populate('quizId', 'title subject')
      .populate('studentId', 'name email studentId')
      .sort({ submittedAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  quizTitle: { type: String, required: true },
  subject: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  answers: [{
    questionIndex: Number,
    selectedOptionIndex: Number,
    isCorrect: Boolean
  }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  attemptNumber: { type: Number, default: 1 },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true, default: 0 },
  explanation: { type: String, default: '' },
  marks: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  subject: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  className: { type: String, default: '' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema],
  totalMarks: { type: Number, default: 0 },
  timeLimitMinutes: { type: Number, default: 15 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);

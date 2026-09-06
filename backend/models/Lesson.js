const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String }
});

const lessonSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  subjectName: { type: String, required: true },
  chapterNumber: { type: Number, default: 1 },
  chapterTitle: { type: String, required: true }, // e.g. "Fractions", "Photosynthesis"
  title: { type: String, required: true },
  summary: { type: String },
  content: { type: String, required: true },
  keyConcepts: [{ type: String }],
  videoUrl: { type: String },
  pdfUrl: { type: String },
  quiz: [quizQuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);

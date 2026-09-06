const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectName: { type: String, required: true },
  percentage: { type: Number, default: 0 },
  completedLessons: [{ type: String }],
  quizAverage: { type: Number, default: 80 },
  weakTopics: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);

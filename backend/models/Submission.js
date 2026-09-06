const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  textAnswer: { type: String },
  fileUrl: { type: String },
  audioUrl: { type: String },
  score: { type: Number, default: null },
  feedback: { type: String, default: '' },
  status: { type: String, enum: ['Submitted', 'Graded'], default: 'Submitted' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String
  }],
  attachments: [{ type: String }],
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);

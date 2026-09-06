const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: { type: String, required: true }, // e.g. "Class 7A"
  classCode: { type: String, required: true, unique: true }, // e.g. "ABC123"
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subjectName: { type: String, default: 'General Studies' }, // Keeping from old schema
  grade: { type: String, default: '7' }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);

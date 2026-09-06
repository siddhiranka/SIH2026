const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Mathematics, Science, English, Social Science
  code: { type: String, required: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#6C4DF6' },
  gradeLevel: { type: String, default: 'Class 7' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);

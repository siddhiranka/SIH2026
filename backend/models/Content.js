const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'file', 'link'], default: 'text' },
  content: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  className: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);

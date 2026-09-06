const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  className: { type: String, default: '' }, // Denormalized name
  preferredLanguage: { type: String, default: 'English' }, // Added for translations
  learningPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  badges: [{
    id: String,
    title: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Class = require('../models/Class');
const { protect } = require('../middleware/auth.middleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'learnmate_secret_jwt_key_sih2026_super_safe', {
    expiresIn: '30d'
  });
};

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.findOne({ studentId: email });
    }

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        classId: user.classId,
        className: user.className,
        preferredLanguage: user.preferredLanguage,
        learningPoints: user.learningPoints,
        streak: user.streak,
        token
      });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, classCode, preferredLanguage } = req.body;
    
    let classObj = null;
    let studentId = '';

    // If student is registering, they must provide a valid classCode
    if (role === 'student') {
      if (!classCode) return res.status(400).json({ message: 'Class Code is required for students' });
      const cleanCode = classCode.trim().toUpperCase();
      classObj = await Class.findOne({ classCode: cleanCode });
      if (!classObj) return res.status(400).json({ message: 'Invalid class code. Please check with your teacher.' });
      studentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      studentId,
      classId: classObj ? classObj._id : undefined,
      className: classObj ? classObj.className : '',
      preferredLanguage: preferredLanguage || 'English'
    });

    // Add student to class
    if (classObj) {
      classObj.students.push(user._id);
      await classObj.save();
    }

    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      classId: user.classId,
      className: user.className,
      preferredLanguage: user.preferredLanguage,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;

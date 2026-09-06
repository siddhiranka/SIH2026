const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const seedDatabaseIfNeeded = async () => {
  const User = require('../models/User');
  const Class = require('../models/Class');

  const count = await User.countDocuments();
  if (count === 0) {
    console.log('[DB] Database is empty. Seeding initial data...');

    const teacher = await User.create({
      name: 'Mrs. Sharma',
      email: 'teacher@learnmate.edu',
      password: 'teacher123',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
    });

    const class7A = await Class.create({
      className: 'Class 7A',
      classCode: 'ABC123',
      subjectName: 'Mathematics & Science',
      grade: '7',
      teacherId: teacher._id,
      students: []
    });

    const siddhi = await User.create({
      name: 'Siddhi Ranka',
      email: 'siddhi@learnmate.edu',
      studentId: 'STU-7001',
      password: 'student123',
      role: 'student',
      classId: class7A._id,
      className: 'Class 7A',
      learningPoints: 180,
      streak: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
    });

    class7A.students.push(siddhi._id);
    await class7A.save();

    console.log('[DB] Seed complete!');
    console.log('[DB] Teacher login: teacher@learnmate.edu / teacher123');
    console.log('[DB] Student login: siddhi@learnmate.edu / student123');
    console.log('[DB] Class code for students: ABC123');
  }
};

const connectDB = async () => {
  // If already connected (reusing connection across serverless functions on Vercel)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // 1. Try MONGO_URI from environment (Atlas or external)
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('[MongoDB] Connected via MONGO_URI (Atlas/External)');
      await seedDatabaseIfNeeded();
      return;
    } catch (err) {
      console.warn('[MongoDB] MONGO_URI failed:', err.message, '— trying fallback...');
    }
  }

  // 2. Try local MongoDB on default port (if running locally)
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/learnmate', { serverSelectionTimeoutMS: 3000 });
    console.log('[MongoDB] Connected to local MongoDB (port 27017)');
    await seedDatabaseIfNeeded();
    return;
  } catch (err) {
    console.warn('[MongoDB] Local MongoDB not running.');
  }

  // On Vercel / serverless without MONGO_URI, warn user
  if (process.env.VERCEL) {
    console.warn('[MongoDB Warning] Running on Vercel without MONGO_URI. Please set MONGO_URI in your Vercel Project Settings for full cloud database persistence.');
    return;
  }

  // 3. Fall back to MongoMemoryServer with PERSISTENT storage for local development
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');

    // Persist DB files to disk so data survives restarts
    const dbPath = path.join(__dirname, '..', 'data', 'mongomem');
    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });

    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath,
        storageEngine: 'wiredTiger',
        launchTimeout: 120000
      }
    });

    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('[MongoDB] Persistent in-memory server running at:', uri);
    console.log('[MongoDB] Data stored at:', dbPath);
    await seedDatabaseIfNeeded();
  } catch (err) {
    console.error('[MongoDB] Local storage fallback failed:', err.message);
  }
};

module.exports = connectDB;
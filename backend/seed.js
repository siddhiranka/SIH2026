const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const Lesson = require('./models/Lesson');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnmate');
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Class.deleteMany();
    await Subject.deleteMany();
    await Lesson.deleteMany();
    await Assignment.deleteMany();
    await Submission.deleteMany();

    console.log('Seeding Users...');
    const teacher = await User.create({
      name: 'Mrs. Sharma',
      email: 'teacher@learnmate.edu',
      password: 'teacher123',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
    });

    const siddhi = await User.create({
      name: 'Siddhi Ranka',
      email: 'siddhi@learnmate.edu',
      studentId: 'STU-7001',
      password: 'student123',
      role: 'student',
      className: 'Class 7A',
      learningPoints: 180,
      streak: 5,
      badges: [
        { id: 'first_lesson', title: 'First Lesson Complete', icon: '🌟' },
        { id: 'streak_master', title: '5-Day Streak', icon: '🔥' },
        { id: 'quiz_whiz', title: 'Quiz Whiz', icon: '🏆' }
      ],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
    });

    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@learnmate.edu',
      studentId: 'STU-7002',
      password: 'student123',
      role: 'student',
      className: 'Class 7A',
      learningPoints: 120,
      streak: 3,
      badges: [
        { id: 'welcome', title: 'New Learner', icon: '🌟' }
      ],
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80'
    });

    console.log('Seeding Classes...');
    const class7A = await Class.create({
      name: 'Class 7A',
      subjectName: 'Mathematics & Science',
      grade: '7',
      teacherId: teacher._id,
      studentsCount: 32,
      averageScore: 78
    });

    const class7B = await Class.create({
      name: 'Class 7B',
      subjectName: 'Mathematics',
      grade: '7',
      teacherId: teacher._id,
      studentsCount: 28,
      averageScore: 84
    });

    console.log('Seeding Subjects...');
    const math = await Subject.create({
      name: 'Mathematics',
      code: 'MATH-7',
      icon: '📐',
      color: '#6C4DF6',
      gradeLevel: 'Class 7',
      description: 'Explore numbers, fractions, algebra, and geometry through clear visual steps.'
    });

    const science = await Subject.create({
      name: 'Science',
      code: 'SCI-7',
      icon: '🔬',
      color: '#4DB8FF',
      gradeLevel: 'Class 7',
      description: 'Discover living organisms, plants, energy, and physical phenomena.'
    });

    const english = await Subject.create({
      name: 'English',
      code: 'ENG-7',
      icon: '📖',
      color: '#FFD84D',
      gradeLevel: 'Class 7',
      description: 'Improve reading comprehension, creative writing, and grammar.'
    });

    const social = await Subject.create({
      name: 'Social Science',
      code: 'SOC-7',
      icon: '🌍',
      color: '#5BCB93',
      gradeLevel: 'Class 7',
      description: 'Understand geography, history, and civics in an engaging story format.'
    });

    console.log('Seeding Lessons...');
    const fractionsLesson = await Lesson.create({
      subjectId: math._id,
      subjectName: 'Mathematics',
      chapterNumber: 3,
      chapterTitle: 'Fractions & Decimals',
      title: 'Understanding Numerators, Denominators & Equivalent Fractions',
      summary: 'Learn how fractions represent equal parts of a whole and how to simplify them.',
      content: `A fraction represents a part of a whole number. When we slice a whole apple pie into 4 equal slices, each slice is **1/4** (one-fourth) of the pie.

### Parts of a Fraction:
1. **Numerator (Top Number)**: Shows how many equal parts are taken or selected.
2. **Denominator (Bottom Number)**: Shows the total number of equal parts in the whole object.

### Equivalent Fractions:
Fractions that have different numerators and denominators but equal value. For example:
- 1/2 = 2/4 = 4/8

To make an equivalent fraction, multiply or divide both the numerator and denominator by the same non-zero number!`,
      keyConcepts: [
        'A fraction represents part of a whole divided into equal pieces.',
        'The Numerator is on top; the Denominator is on bottom.',
        'Multiply top and bottom by the same number to get an equivalent fraction.'
      ],
      videoUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw',
      quiz: [
        {
          question: 'In the fraction 3/8, which number is the numerator?',
          options: ['3', '8', '11', '5'],
          correctAnswerIndex: 0,
          explanation: '3 is the top number, which is called the numerator!'
        },
        {
          question: 'Which of the following is equivalent to 1/2?',
          options: ['2/3', '3/6', '1/3', '4/10'],
          correctAnswerIndex: 1,
          explanation: '3/6 simplifies to 1/2 when both top and bottom are divided by 3.'
        }
      ]
    });

    const scienceLesson = await Lesson.create({
      subjectId: science._id,
      subjectName: 'Science',
      chapterNumber: 1,
      chapterTitle: 'Nutrition in Plants',
      title: 'Photosynthesis & Solar Energy',
      summary: 'Explore how green plants convert solar sunlight into chemical energy.',
      content: `Green plants prepare their own food through a process called **Photosynthesis**.

### Requirements for Photosynthesis:
1. **Chlorophyll**: Green pigment present in leaves that traps solar light energy.
2. **Water & Minerals**: Absorbed by plant roots from the soil.
3. **Carbon Dioxide**: Taken in from air through small pores on leaves called **Stomata**.
4. **Sunlight**: Powers the chemical reaction.

### Equation:
Carbon Dioxide + Water + Sunlight ➔ Glucose (Sugar) + Oxygen!`,
      keyConcepts: [
        'Photosynthesis means "putting together with light".',
        'Chlorophyll in leaves traps sunlight energy.',
        'Leaves release clean oxygen into the atmosphere for humans and animals to breathe.'
      ],
      videoUrl: 'https://www.youtube.com/embed/UPBMG5EYydo',
      quiz: [
        {
          question: 'What is the green pigment in leaves that absorbs sunlight?',
          options: ['Stomata', 'Chlorophyll', 'Glucose', 'Oxygen'],
          correctAnswerIndex: 1,
          explanation: 'Chlorophyll is the green pigment responsible for catching sunlight!'
        }
      ]
    });

    console.log('Seeding Assignments...');
    const assign1 = await Assignment.create({
      title: 'Fractions Problem Solving Homework',
      description: 'Solve problems 1 through 5 on simplifying fractions and finding equivalent fractions. You can write your answer in text or upload a photo of your notebook.',
      subject: 'Mathematics',
      teacherId: teacher._id,
      classId: class7A._id,
      className: 'Class 7A',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      totalPoints: 10
    });

    const assign2 = await Assignment.create({
      title: 'Photosynthesis Diagram & Explanation',
      description: 'Draw a neat diagram of a leaf showing sunlight, stomata, carbon dioxide, and oxygen release. Submit your work image or explanation.',
      subject: 'Science',
      teacherId: teacher._id,
      classId: class7A._id,
      className: 'Class 7A',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalPoints: 10
    });

    console.log('Seeding Submissions...');
    await Submission.create({
      assignmentId: assign1._id,
      studentId: rahul._id,
      studentName: rahul.name,
      textAnswer: '1) 2/4 = 1/2\n2) 3/9 = 1/3\n3) 4/8 = 1/2\n4) 5/10 = 1/2\n5) 6/12 = 1/2',
      score: null,
      status: 'Submitted'
    });

    await Submission.create({
      assignmentId: assign1._id,
      studentId: siddhi._id,
      studentName: siddhi.name,
      textAnswer: 'Attached photo of my solved notebook page. Verified equivalent fractions by dividing top and bottom by GCD.',
      score: 10,
      feedback: 'Excellent work Siddhi! Very neat presentation and accurate steps.',
      status: 'Graded'
    });

    console.log('✅ Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedData();

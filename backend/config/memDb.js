// Instant In-Memory Database Fallback Engine for zero-latency local operation

class MemoryStore {
  constructor() {
    this.users = [];
    this.classes = [];
    this.subjects = [];
    this.lessons = [];
    this.content = [];
    this.assignments = [];
    this.submissions = [];
    this.seed();
  }

  seed() {
    const teacherId = 't-101';
    const siddhiId = 's-101';
    const rahulId = 's-102';

    this.users = [
      {
        _id: teacherId,
        name: 'Mrs. Sharma',
        email: 'teacher@learnmate.edu',
        password: 'teacher123',
        role: 'teacher',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
      },
      {
        _id: siddhiId,
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
      },
      {
        _id: rahulId,
        name: 'Rahul Sharma',
        email: 'rahul@learnmate.edu',
        studentId: 'STU-7002',
        password: 'student123',
        role: 'student',
        className: 'Class 7A',
        learningPoints: 120,
        streak: 3,
        badges: [{ id: 'welcome', title: 'New Learner', icon: '🌟' }],
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80'
      }
    ];

    this.classes = [
      { _id: 'c-1', name: 'Class 7A', subjectName: 'Mathematics & Science', grade: '7', teacherId, studentsCount: 32, averageScore: 78 },
      { _id: 'c-2', name: 'Class 7B', subjectName: 'Mathematics', grade: '7', teacherId, studentsCount: 28, averageScore: 84 }
    ];

    this.subjects = [
      { _id: 'sub-1', name: 'Mathematics', code: 'MATH-7', icon: '📐', color: '#6C4DF6', gradeLevel: 'Class 7', description: 'Explore numbers, fractions, algebra, and geometry.' },
      { _id: 'sub-2', name: 'Science', code: 'SCI-7', icon: '🔬', color: '#4DB8FF', gradeLevel: 'Class 7', description: 'Discover living organisms, plants, energy, and physical phenomena.' },
      { _id: 'sub-3', name: 'English', code: 'ENG-7', icon: '📖', color: '#FFD84D', gradeLevel: 'Class 7', description: 'Improve reading comprehension, creative writing, and grammar.' },
      { _id: 'sub-4', name: 'Social Science', code: 'SOC-7', icon: '🌍', color: '#5BCB93', gradeLevel: 'Class 7', description: 'Understand geography, history, and civics.' }
    ];

    this.lessons = [
      {
        _id: 'les-1',
        subjectName: 'Mathematics',
        chapterNumber: 3,
        chapterTitle: 'Fractions & Decimals',
        title: 'Understanding Numerators, Denominators & Equivalent Fractions',
        summary: 'Learn how fractions represent equal parts of a whole and how to simplify them.',
        content: `A fraction represents a part of a whole number. When we slice a whole apple pie into 4 equal slices, each slice is 1/4 (one-fourth) of the pie.

### Key Parts of a Fraction:
1. **Numerator (Top Number)**: Shows how many equal parts are taken or selected.
2. **Denominator (Bottom Number)**: Shows the total number of equal parts in the whole object.

### Equivalent Fractions:
Fractions that have different numerators and denominators but equal total value. For example:
• 1/2 = 2/4 = 4/8

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
      }
    ];

    this.content = [
      {
        _id: 'cnt-1',
        title: 'Fractions & Decimals — Chapter Notes',
        description: 'Complete notes on Numerators, Denominators, and Equivalent Fractions for Class 7A.',
        subject: 'Mathematics',
        classId: 'c-1',
        className: 'Class 7A',
        teacherId,
        type: 'text', // 'text', 'file', 'link'
        content: `### Fractions & Decimals Overview\n\n1. **Numerator**: Top number representing equal parts selected.\n2. **Denominator**: Bottom number representing total parts.\n3. **Equivalent Fractions**: Fractions with equal total value (e.g. 1/2 = 2/4 = 4/8).`,
        fileUrl: '',
        externalUrl: '',
        status: 'published', // 'draft' or 'published'
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        _id: 'cnt-2',
        title: 'Photosynthesis Video & Diagram Worksheet',
        description: 'Visual breakdown of plant photosynthesis for Grade 7 Science.',
        subject: 'Science',
        classId: 'c-1',
        className: 'Class 7A',
        teacherId,
        type: 'link',
        content: 'Watch the video explanation and review the process of glucose generation in plants.',
        fileUrl: '',
        externalUrl: 'https://www.youtube.com/watch?v=n0FZhQ_GkKw',
        status: 'published',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        _id: 'cnt-3',
        title: 'Algebraic Equations Revision Draft',
        description: 'Draft notes on solving single variable linear equations.',
        subject: 'Mathematics',
        classId: 'c-2',
        className: 'Class 7B',
        teacherId,
        type: 'text',
        content: 'Draft content for Class 7B. To solve x + 5 = 12, subtract 5 from both sides: x = 7.',
        fileUrl: '',
        externalUrl: '',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.assignments = [
      {
        _id: 'as-1',
        title: 'Fractions Problem Solving Homework',
        description: 'Solve problems 1 through 5 on simplifying fractions and finding equivalent fractions.',
        subject: 'Mathematics',
        teacherId,
        classId: 'c-1',
        className: 'Class 7A',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        totalPoints: 10
      }
    ];

    this.submissions = [
      {
        _id: 'subm-1',
        assignmentId: 'as-1',
        studentId: siddhiId,
        studentName: 'Siddhi Ranka',
        textAnswer: 'Attached photo of my solved notebook page. Verified equivalent fractions by dividing top and bottom by GCD.',
        score: 10,
        feedback: 'Excellent work Siddhi! Very neat presentation and accurate steps.',
        status: 'Graded',
        submittedAt: new Date()
      },
      {
        _id: 'subm-2',
        assignmentId: 'as-1',
        studentId: rahulId,
        studentName: 'Rahul Sharma',
        textAnswer: '1) 2/4 = 1/2\n2) 3/9 = 1/3\n3) 4/8 = 1/2',
        score: null,
        feedback: '',
        status: 'Submitted',
        submittedAt: new Date()
      }
    ];
  }
}

const memStore = new MemoryStore();
module.exports = memStore;

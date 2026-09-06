import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import MyLearningPage from './pages/MyLearningPage';
import LessonDetailPage from './pages/LessonDetailPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AITutorPage from './pages/AITutorPage';
import VoiceHelpPage from './pages/VoiceHelpPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClassesPage from './pages/TeacherClassesPage';
import TeacherAssignmentsPage from './pages/TeacherAssignmentsPage';
import TeacherContentPage from './pages/TeacherContentPage';
import TeacherAIPage from './pages/TeacherAIPage';
import TeacherQuizzesPage from './pages/TeacherQuizzesPage';
import QuizPage from './pages/QuizPage';

// Protected Route Wrapper (Full-Screen Layout - Priority Item 1 & 4)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} replace />;
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Landing Page Route */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student Protected Routes */}
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/my-learning" element={<ProtectedRoute allowedRoles={['student']}><MyLearningPage /></ProtectedRoute>} />
      <Route path="/quiz/:id" element={<ProtectedRoute allowedRoles={['student']}><QuizPage /></ProtectedRoute>} />
      <Route path="/lesson/:id" element={<ProtectedRoute allowedRoles={['student']}><LessonDetailPage /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute allowedRoles={['student']}><AssignmentsPage /></ProtectedRoute>} />
      <Route path="/ai-tutor" element={<ProtectedRoute allowedRoles={['student']}><AITutorPage /></ProtectedRoute>} />
      <Route path="/voice-help" element={<ProtectedRoute allowedRoles={['student']}><VoiceHelpPage /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute allowedRoles={['student']}><ProgressPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfilePage /></ProtectedRoute>} />

      {/* Teacher Protected Routes */}
      <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher-classes" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherClassesPage /></ProtectedRoute>} />
      <Route path="/teacher-quizzes" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherQuizzesPage /></ProtectedRoute>} />
      <Route path="/teacher-assignments" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherAssignmentsPage /></ProtectedRoute>} />
      <Route path="/teacher-content" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherContentPage /></ProtectedRoute>} />
      <Route path="/teacher-ai" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherAIPage /></ProtectedRoute>} />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

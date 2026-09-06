import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Bot, 
  BarChart2, 
  User, 
  Users, 
  FolderPlus, 
  Sparkles 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  // PRD Section 7 Navigation
  const studentLinks = [
    { to: '/student-dashboard', icon: Home, label: 'Home' },
    { to: '/my-learning', icon: BookOpen, label: 'My Learning' },
    { to: '/assignments', icon: FileText, label: 'Assignments' },
    { to: '/ai-tutor', icon: Bot, label: 'AI Tutor', badge: 'AI' },
    { to: '/progress', icon: BarChart2, label: 'Progress' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const teacherLinks = [
    { to: '/teacher-dashboard', icon: Home, label: 'Home' },
    { to: '/teacher-classes', icon: Users, label: 'My Classes' },
    { to: '/teacher-content', icon: FolderPlus, label: 'Content' },
    { to: '/teacher-assignments', icon: FileText, label: 'Assignments' },
    { to: '/teacher-classes', icon: Users, label: 'Students' },
    { to: '/teacher-ai', icon: Bot, label: 'AI Assistant', badge: 'AI' },
  ];

  const links = user.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-orange-100 hidden md:flex flex-col min-h-[calc(100vh-65px)] p-4">
      <div className="space-y-1 flex-1">
        <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider px-3 mb-2">
          {user.role === 'teacher' ? 'Teacher Portal' : 'Student Navigation'}
        </p>

        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={`${link.to}-${idx}`}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-md shadow-orange-500/20'
                    : 'text-brand-text hover:bg-brand-orange-light hover:text-brand-orange'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-brand-orange-soft text-brand-orange rounded-full shadow-sm">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Educational Support Banner */}
      <div className="bg-brand-orange-light rounded-3xl p-4 mt-6 text-center border border-orange-200 shadow-sm relative overflow-hidden">
        <div className="w-10 h-10 bg-brand-orange text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
          <Sparkles className="w-5 h-5 fill-white text-white" />
        </div>
        <h4 className="font-display font-bold text-sm text-brand-text">Need Assistance?</h4>
        <p className="text-xs text-brand-muted mt-1 leading-snug">
          {user.role === 'teacher' 
            ? 'Generate revision quizzes in 1 click!'
            : 'Ask LearnMate AI using text or voice anytime!'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, BookOpen, Home, FileText, Bot, BarChart2, User, Users, FolderPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: '📝 New Assignment', message: 'Fractions Problem Solving due in 2 days.' },
    { id: 2, title: '🏆 Achievement Unlocked', message: 'You earned the 5-Day Streak badge! 🔥' }
  ];

  // Student Navigation Links
  const studentNavLinks = [
    { to: '/student-dashboard', label: 'Home' },
    { to: '/my-learning', label: 'My Learning' },
    { to: '/assignments', label: 'Assignments' },
    { to: '/ai-tutor', label: 'AI Tutor' },
    { to: '/progress', label: 'Progress' },
    { to: '/profile', label: 'Profile' },
  ];

  // Teacher Navigation Links
  const teacherNavLinks = [
    { to: '/teacher-dashboard', label: 'Dashboard' },
    { to: '/teacher-classes', label: 'Classes' },
    { to: '/teacher-content', label: 'Content' },
    { to: '/teacher-quizzes', label: 'Quizzes' },
    { to: '/teacher-assignments', label: 'Assignments' },
    { to: '/teacher-ai', label: 'AI Assistant' },
  ];

  const navLinks = user?.role === 'teacher' ? teacherNavLinks : studentNavLinks;

  return (
    <header className="bg-white border-b border-[#F0D8C5] sticky top-0 z-40 px-4 lg:px-8 shadow-sm w-full h-[72px] flex items-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={() => navigate(user ? (user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard') : '/')}
        >
          <div className="w-10 h-10 rounded-2xl bg-brand-orange flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            LM
          </div>
          <div>
            <span className="font-display font-bold text-xl text-brand-text tracking-wide flex items-center gap-1">
              LearnMate <span className="text-brand-orange">AI</span>
            </span>
            <span className="text-[11px] text-brand-muted block -mt-1 font-medium">Simple Educational Platform</span>
          </div>
        </div>

        {/* Navigation Links */}
        {user ? (
          /* Logged In Top Navbar for Students/Teachers */
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-orange text-white shadow-sm'
                      : 'text-brand-text hover:bg-brand-orange-light hover:text-brand-orange'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        ) : (
          /* Public Landing Page Navbar (Item 9: Home, Features, About) */
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-brand-muted">
            <a href="#hero" className="hover:text-brand-orange transition-colors">Home</a>
            <a href="#features" className="hover:text-brand-orange transition-colors">Features</a>
            <a href="#about" className="hover:text-brand-orange transition-colors">About</a>
          </nav>
        )}

        {/* User Avatar, Notifications & Login / Logout Buttons */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Role Indicator */}
            <span className="hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full capitalize bg-brand-orange-light text-brand-orange border border-orange-200">
              {user.role}
            </span>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-full bg-brand-orange-light text-brand-text hover:bg-orange-100 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-brand-orange" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-xl border border-orange-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-orange-100 mb-2">
                    <h4 className="font-bold text-xs text-brand-text">🔔 Notifications</h4>
                    <span className="text-[10px] text-brand-orange font-bold cursor-pointer">Clear</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2 rounded-xl bg-brand-orange-light/60">
                        <p className="font-bold text-xs text-brand-text">{n.title}</p>
                        <p className="text-[11px] text-brand-muted mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
                alt={user.name}
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-orange/30 cursor-pointer"
              />

              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-bold text-brand-text hover:text-brand-orange transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-2xl shadow-md transition-all hover:scale-105"
            >
              Get Started
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, GraduationCap, Lock, Mail, ArrowRight, Loader2, Key } from 'lucide-react';
import api from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classCode, setClassCode] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(email, password, role);
      setIsSubmitting(false);

      if (res.success) {
        navigate(res.user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
      } else {
        setError(res.error || 'Invalid login details.');
      }
    } else {
      try {
        const payload = { name, email, password, role };
        if (role === 'student') {
          payload.classCode = classCode;
          payload.preferredLanguage = preferredLanguage;
        }

        const res = await api.post('/auth/register', payload);
        const loginRes = await login(email, password, role);
        setIsSubmitting(false);
        if (loginRes.success) {
          navigate(loginRes.user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        } else {
          setError('Signup successful, but login failed.');
        }
      } catch (err) {
        setIsSubmitting(false);
        setError(err.response?.data?.message || 'Error signing up');
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-orange-light flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-4xl shadow-xl border border-orange-200 w-full max-w-md p-8 animate-in fade-in zoom-in-95">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-orange rounded-3xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-md">
            LM
          </div>
          <h2 className="font-display font-extrabold text-2xl text-brand-text flex items-center justify-center gap-2">
            {isLogin ? 'Welcome Back' : 'Join LearnMate'} <span className="text-brand-orange">AI</span>
          </h2>
        </div>

        <div className="flex bg-brand-orange-light p-1.5 rounded-2xl mb-6 border border-orange-200">
          <button
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'bg-brand-orange text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('teacher'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${role === 'teacher' ? 'bg-brand-orange text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}
          >
            <User className="w-4 h-4" />
            <span>Teacher</span>
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white border border-orange-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">
              {role === 'student' ? 'Email / Student ID' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-white border border-orange-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-orange-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50" />
            </div>
          </div>

          {!isLogin && role === 'student' && (
            <>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Class Code</label>
                <div className="relative">
                  <Key className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input type="text" required value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())} placeholder="ABC123" className="w-full bg-white border border-orange-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-brand-text uppercase focus:outline-none focus:ring-2 focus:ring-brand-orange/50" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Preferred Language</label>
                <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full bg-white border border-orange-200 rounded-2xl px-4 py-3 text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{isLogin ? 'Login' : 'Sign Up'}</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-brand-orange hover:underline">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

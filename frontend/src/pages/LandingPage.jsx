import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, BookOpen, Bot, Mic, BarChart2, ArrowRight, Check, X, 
  Globe, User, MessageSquare, Compass, Shield, Award, Lightbulb, 
  GraduationCap, Cpu, Layers, Triangle, Ruler, Calculator, 
  Microscope, FlaskConical, Atom, Telescope, Pencil, Scroll 
} from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleSelectRole = (role) => {
    setShowRoleModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-white text-brand-text flex flex-col justify-between overflow-x-hidden relative">
      
      {/* ================= BACKGROUND FLOATING EDUCATIONAL SVG ELEMENTS (LUCIDE ICONS — HIGH VISIBILITY Z-20) ================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.12]">
        
        {/* 1. Math: Triangle (Top Left) */}
        <motion.div 
          className="absolute left-[3%] top-[14%] sm:left-[5%] sm:top-[16%] text-brand-orange p-3 "
          animate={{ y: [0, -14, 0], rotate: [-4, 6, -4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Triangle className="w-6 h-6 stroke-[2.5]" />
        </motion.div>

        {/* 2. Science: FlaskConical (Top Right) */}
        <motion.div 
          className="absolute right-[4%] top-[12%] sm:right-[6%] sm:top-[14%] text-brand-orange p-3 "
          animate={{ y: [0, 16, 0], rotate: [4, -4, 4] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FlaskConical className="w-6 h-6 stroke-[2.5]" />
        </motion.div>

        {/* 3. Math: Ruler (Upper Mid Left) */}
        <motion.div 
          className="absolute left-[10%] top-[34%] text-brand-orange p-2.5 "
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Ruler className="w-5 h-5 stroke-[2.5]" />
        </motion.div>

        {/* 4. Geography: Globe (Middle Left) */}
        <motion.div 
          className="absolute left-[2%] top-[48%] sm:left-[4%] sm:top-[46%] text-brand-orange p-3 "
          animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Globe className="w-6 h-6 stroke-[2.5]" />
        </motion.div>

        {/* 5. Science: Atom (Middle Right) */}
        <motion.div 
          className="absolute right-[2%] top-[48%] sm:right-[4%] sm:top-[46%] text-brand-orange p-3 "
          animate={{ y: [0, 15, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Atom className="w-6 h-6 stroke-[2.5]" />
        </motion.div>

        {/* 6. Education: GraduationCap (Center Top) */}
        <motion.div 
          className="absolute left-[47%] top-[8%] text-brand-orange p-2.5 "
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <GraduationCap className="w-5 h-5 stroke-[2.5]" />
        </motion.div>

        {/* 7. Science: Microscope (Lower Left) */}
        <motion.div 
          className="absolute left-[5%] top-[76%] text-brand-orange p-3 "
          animate={{ y: [0, -14, 0], rotate: [3, -3, 3] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Microscope className="w-6 h-6 stroke-[2.5]" />
        </motion.div>

        {/* 8. Education: Lightbulb (Lower Right) */}
        <motion.div 
          className="absolute right-[5%] top-[74%] text-brand-orange p-3 "
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lightbulb className="w-6 h-6 stroke-[2.5]" />
        </motion.div>

        {/* 9. Math: Calculator (Lower Mid Right) */}
        <motion.div 
          className="absolute right-[12%] top-[34%] text-brand-orange p-2.5 "
          animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Calculator className="w-5 h-5 stroke-[2.5]" />
        </motion.div>

        {/* 10. Geography: Compass (Bottom Center Left) */}
        <motion.div 
          className="absolute left-[30%] top-[88%] text-brand-orange p-2 "
          animate={{ y: [0, -8, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Compass className="w-5 h-5 stroke-[2.5]" />
        </motion.div>

        {/* 11. General: BookOpen (Bottom Center Right) */}
        <motion.div 
          className="absolute right-[30%] top-[88%] text-brand-orange p-2 "
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="w-5 h-5 stroke-[2.5]" />
        </motion.div>

      </div>

      {/* 1. PUBLIC NAVBAR (Item 8) */}
      <Navbar />

      {/* 2. HERO SECTION — SCREEN 1 (Fills initial viewport completely: 100vh - navbar height) */}
      <section id="hero" className="w-full min-h-[calc(100vh-76px)] flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* LEFT SIDE (45% Width on Desktop) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            
            {/* AI Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-orange-light border border-orange-200 text-brand-orange font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
              <span>AI-Powered Educational Platform</span>
            </div>

            {/* Main Headings */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[60px] text-brand-text tracking-tight leading-[1.05]">
              Learn Smarter. <br />
              <span className="text-brand-orange">Learn Better.</span>
            </h1>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-brand-muted font-medium leading-relaxed max-w-[540px]">
              A simple AI-powered learning platform that helps students learn, ask questions, and stay connected with their learning while helping teachers create and manage educational content.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setShowRoleModal(true)}
                className="px-6 py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2 text-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#why"
                className="px-6 py-3.5 bg-white hover:bg-orange-50 text-brand-orange font-bold rounded-2xl border-2 border-brand-orange transition-colors flex items-center justify-center text-xs"
              >
                Learn More
              </a>
            </div>

          </div>

          {/* RIGHT SIDE (55% Width on Desktop — NEW PNG ILLUSTRATION) */}
          <div className="lg:col-span-7 flex justify-center items-center relative">

            <div className="relative w-full max-w-lg p-2 bg-brand-orange-light/30 rounded-3xl border border-orange-100/60 shadow-sm flex items-center justify-center">
              <motion.img
                src="/assets/new-hero-illustration.png"
                alt="New Educational Illustration - LearnMate AI"
                className="w-full h-auto object-contain max-h-[340px] sm:max-h-[370px] lg:max-h-[400px] drop-shadow-md rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                transition={{ 
                  opacity: { duration: 0.6 },
                  scale: { duration: 0.6 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW LEARNMATE AI HELPS SECTION */}
      <section id="why" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-orange-100 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-brand-text">
            How LearnMate AI Helps
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">Designed to make education accessible, engaging, and structured.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:border-brand-orange transition-all space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-xl">
              📚
            </div>
            <h3 className="font-display font-bold text-lg text-brand-text">Learn</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Access lessons and educational content.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:border-brand-orange transition-all space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-xl">
              🤖
            </div>
            <h3 className="font-display font-bold text-lg text-brand-text">Ask AI</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Get explanations when you need help.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:border-brand-orange transition-all space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-xl">
              🎤
            </div>
            <h3 className="font-display font-bold text-lg text-brand-text">Speak</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Ask questions using your voice.</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:border-brand-orange transition-all space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-xl">
              📊
            </div>
            <h3 className="font-display font-bold text-lg text-brand-text">Track</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Monitor your learning progress.</p>
          </div>

        </div>
      </section>

      {/* 4. KEY FEATURES SECTION (Item 6) */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-brand-orange-light/30 border-y border-orange-100 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-brand-text">
            Key Features
          </h2>
          <p className="text-sm text-brand-muted">Simple, accessible tools built for effective learning.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Learning Content */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all text-center space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              📚
            </div>
            <h3 className="font-display font-bold text-base text-brand-text">Learning Content</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Access teacher-published notes, documents, and videos.</p>
          </div>

          {/* Card 2: AI Tutor */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all text-center space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              🤖
            </div>
            <h3 className="font-display font-bold text-base text-brand-text">AI Tutor</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Get hints and step-by-step concept explanations.</p>
          </div>

          {/* Card 3: Voice Assistance */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all text-center space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              🎤
            </div>
            <h3 className="font-display font-bold text-base text-brand-text">Voice Assistance</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Speak questions naturally using microphone input.</p>
          </div>

          {/* Card 4: Progress Tracking */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all text-center space-y-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              📊
            </div>
            <h3 className="font-display font-bold text-base text-brand-text">Progress Tracking</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Track assignment completion and subject mastery.</p>
          </div>

        </div>
      </section>

      {/* 5. FOR STUDENTS & FOR TEACHERS SECTION (Item 4 & 36) */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-brand-text">
            One Platform. Two Experiences.
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">Tailored environments for students and teachers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Students Column */}
          <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-md space-y-6 flex flex-col justify-between hover:border-brand-orange transition-all">
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full border border-orange-200">
                For Students
              </span>
              <h3 className="font-display font-bold text-2xl text-brand-text">Interactive Student Learning Space</h3>
              <ul className="space-y-2.5 text-xs font-semibold text-brand-text">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Learn at your own pace</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Ask the AI Tutor in 7 languages</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Use voice assistance microphone</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> View published teacher material</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Submit assignments & track progress</li>
              </ul>
            </div>

            <button
              onClick={() => setShowRoleModal(true)}
              className="w-full py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Student Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* For Teachers Column */}
          <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-md space-y-6 flex flex-col justify-between hover:border-brand-orange transition-all">
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full border border-orange-200">
                For Teachers
              </span>
              <h3 className="font-display font-bold text-2xl text-brand-text">Teacher Content Management Suite</h3>
              <ul className="space-y-2.5 text-xs font-semibold text-brand-text">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Create & publish notes, PDFs & links</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Use AI Assistant to generate lesson drafts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Manage Draft vs Published status</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Create & publish flexible assignments</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-orange" /> Review student submissions & grade</li>
              </ul>
            </div>

            <button
              onClick={() => setShowRoleModal(true)}
              className="w-full py-3.5 bg-white text-brand-orange border-2 border-brand-orange hover:bg-brand-orange hover:text-white font-bold text-xs rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Teacher Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. AI + VOICE MULTILINGUAL SECTION (Item 22 & 24) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center space-y-8 bg-brand-orange-light/40 rounded-3xl border border-orange-200 relative z-10 my-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white text-brand-orange px-3.5 py-1 rounded-full text-xs font-bold border border-orange-200 shadow-sm">
            <Globe className="w-4 h-4 text-brand-orange" />
            <span>Ask. Speak. Understand.</span>
          </div>
          
          <h2 className="font-display font-extrabold text-3xl text-brand-text">
            Learn in the Language You're Comfortable With
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-xl mx-auto">
            Ask questions by typing or speaking and receive explanations in your preferred language (English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu).
          </p>
        </div>

        {/* Small AI Interface Preview */}
        <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-xl text-left space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-bold text-xs shadow-sm">
                🤖
              </div>
              <span className="font-display font-bold text-sm text-brand-text">AI Tutor</span>
            </div>
            <span className="text-[11px] font-bold text-brand-orange bg-brand-orange-light px-2.5 py-1 rounded-lg border border-orange-200">
              Hindi / Hinglish Active
            </span>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div className="p-3.5 bg-brand-orange-light/60 rounded-2xl max-w-[85%] text-brand-text font-semibold border border-orange-100">
              What would you like to learn?
            </div>

            <div className="p-3.5 bg-brand-orange text-white rounded-2xl max-w-[85%] ml-auto font-bold shadow-sm">
              प्रकाश संश्लेषण क्या है? (Photosynthesis kya hai?)
            </div>

            <div className="p-3.5 bg-brand-orange-light/80 rounded-2xl max-w-[90%] text-brand-text leading-relaxed border border-orange-200">
              प्रकाश संश्लेषण वह प्रक्रिया है जिससे पौधे सूर्य के प्रकाश का उपयोग करके अपना भोजन बनाते हैं! 🌿☀️
            </div>
          </div>

          {/* Interactive Mock Input */}
          <div className="pt-2">
            <div className="bg-brand-orange-light/40 border border-orange-200 rounded-full px-5 py-3 text-xs text-brand-muted flex items-center justify-between">
              <span>Ask a question...</span>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-brand-orange" />
                <span className="text-[10px] font-bold text-brand-orange">🎤 Speak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Pills List */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2 max-w-lg mx-auto">
          {['English', 'Hindi (हिन्दी)', 'Marathi (मराठी)', 'Gujarati (ગુજરાતી)', 'Bengali (বাংলা)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)'].map(l => (
            <span key={l} className="text-[11px] font-bold bg-white text-brand-text px-3 py-1 rounded-full border border-orange-200 shadow-sm">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center space-y-10 relative z-10">
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-brand-text">
            How LearnMate AI Works
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">Simple 4-step path to effective learning.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-3xl border border-orange-100 shadow-sm space-y-2 text-center">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold text-xs flex items-center justify-center mx-auto">1</div>
            <h4 className="font-bold text-sm text-brand-text">Sign In</h4>
            <p className="text-xs text-brand-muted">Log in as Student or Teacher.</p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-orange-100 shadow-sm space-y-2 text-center">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold text-xs flex items-center justify-center mx-auto">2</div>
            <h4 className="font-bold text-sm text-brand-text">Pick Language</h4>
            <p className="text-xs text-brand-muted">Choose your preferred language in Profile.</p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-orange-100 shadow-sm space-y-2 text-center">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold text-xs flex items-center justify-center mx-auto">3</div>
            <h4 className="font-bold text-sm text-brand-text">Learn & Ask AI</h4>
            <p className="text-xs text-brand-muted">Study content & ask questions by text or voice.</p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-orange-100 shadow-sm space-y-2 text-center">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold text-xs flex items-center justify-center mx-auto">4</div>
            <h4 className="font-bold text-sm text-brand-text">Track Growth</h4>
            <p className="text-xs text-brand-muted">Complete assignments & view your streak.</p>
          </div>
        </div>
      </section>

      {/* 8. SIMPLE FINAL CTA SECTION */}
      <section className="bg-brand-orange-light/60 py-20 px-4 text-center border-t border-orange-200 w-full space-y-5 relative z-10">
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-brand-text">
            Start Your Learning Journey
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted font-medium">
            Learn, ask questions, practice, and keep track of your progress.
          </p>
        </div>

        <button
          onClick={() => setShowRoleModal(true)}
          className="px-9 py-4 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105 text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-8 bg-white border-t border-[#F0D8C5] text-center text-xs text-brand-muted w-full space-y-3 relative z-10">
        <div className="flex items-center justify-center gap-6 font-bold text-brand-text">
          <a href="#hero" className="hover:text-brand-orange">Home</a>
          <a href="#why" className="hover:text-brand-orange">Why LearnMate</a>
          <a href="#features" className="hover:text-brand-orange">Features</a>
          <a href="#about" className="hover:text-brand-orange">About</a>
          <button onClick={() => setShowRoleModal(true)} className="hover:text-brand-orange">Login</button>
        </div>
        <p>© 2026 LearnMate • Simple AI-Powered Educational Platform</p>
      </footer>

      {/* 10. ROLE SELECTION MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 border border-orange-100">
            <div className="flex justify-between items-center pb-2">
              <h3 className="font-display font-extrabold text-2xl text-brand-text mx-auto">Who are you?</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-400 font-bold hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => handleSelectRole('student')}
                className="p-6 rounded-2xl bg-brand-orange-light/60 border-2 border-orange-200 hover:border-brand-orange transition-all cursor-pointer group space-y-2"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">👩‍🎓</div>
                <h4 className="font-display font-bold text-lg text-brand-text group-hover:text-brand-orange">Student</h4>
              </div>

              <div
                onClick={() => handleSelectRole('teacher')}
                className="p-6 rounded-2xl bg-brand-orange-light/60 border-2 border-orange-200 hover:border-brand-orange transition-all cursor-pointer group space-y-2"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">👩‍🏫</div>
                <h4 className="font-display font-bold text-lg text-brand-text group-hover:text-brand-orange">Teacher</h4>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;

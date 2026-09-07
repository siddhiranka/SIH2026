import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Mic, CheckCircle2, Sparkles, Loader2,
  FileText, Link as LinkIcon, Video, Image, Download, ExternalLink, AlertCircle
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AITutorModal from '../components/AITutorModal';
import VoiceMicButton from '../components/VoiceMicButton';
import QuizWidget from '../components/QuizWidget';

// Helper: detect mime category from fileUrl extension or mimeType
const getFileCategory = (url, mimeType) => {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
  }
  if (lower.includes('.pdf')) return 'pdf';
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)/)) return 'image';
  if (lower.match(/\.(mp4|webm|ogg|mov)/)) return 'video';
  if (lower.match(/\.(doc|docx|ppt|pptx|xls|xlsx)/)) return 'document';
  return 'file';
};

// Helper: detect YouTube/embed URL
const toEmbedUrl = (url) => {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Already an embed URL
  if (url.includes('youtube.com/embed') || url.includes('player.vimeo')) return url;
  return null;
};

const triggerFileDownload = async (url, fallbackName = 'download') => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    const urlFilename = url.split('/').pop().split('?')[0];
    a.download = urlFilename && urlFilename.length < 60 ? urlFilename : fallbackName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    // Fallback if cross-origin fetch is blocked
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = fallbackName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const FileViewer = ({ fileUrl, link, type, contentType, title }) => {
  const effectiveUrl = fileUrl || link;
  const [downloading, setDownloading] = useState(false);
  if (!effectiveUrl && type !== 'text') return null;

  const handleDownloadClick = async () => {
    setDownloading(true);
    await triggerFileDownload(effectiveUrl, (title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_'));
    setDownloading(false);
  };

  // For link type
  if (type === 'link' || contentType === 'link') {
    const embedUrl = toEmbedUrl(effectiveUrl);
    if (embedUrl) {
      return (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-orange-100">
            <iframe src={embedUrl} title="Video Lesson" className="w-full h-full border-0" allowFullScreen />
          </div>
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open in new tab
          </a>
        </div>
      );
    }
    return (
      <a
        href={effectiveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs rounded-2xl transition-all"
      >
        <ExternalLink className="w-4 h-4" /> Open External Resource
      </a>
    );
  }

  // For file type
  if (type === 'file' || contentType === 'file') {
    const category = getFileCategory(effectiveUrl);

    if (category === 'pdf') {
      return (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-orange-200 shadow-sm bg-gray-50" style={{ height: '600px' }}>
            <iframe
              src={effectiveUrl}
              title="PDF Document"
              className="w-full h-full border-0"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <a
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded-2xl transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Open in New Tab
            </a>
          </div>
        </div>
      );
    }

    if (category === 'image') {
      return (
        <div className="space-y-3">
          <img
            src={effectiveUrl}
            alt="Lesson content"
            className="max-w-full rounded-2xl border border-orange-100 shadow-sm"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> {downloading ? 'Downloading...' : 'Download Image'}
            </button>
            <a
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-2xl transition-all"
            >
              <ExternalLink className="w-4 h-4" /> View Full Image
            </a>
          </div>
        </div>
      );
    }

    if (category === 'video') {
      return (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-orange-100">
            <video controls className="w-full h-full" src={effectiveUrl}>
              Your browser does not support the video tag.
            </video>
          </div>
          <button
            onClick={handleDownloadClick}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {downloading ? 'Downloading...' : 'Download Video'}
          </button>
        </div>
      );
    }

    // Generic file (doc, docx, etc.)
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleDownloadClick}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#F47C20] hover:bg-orange-600 text-white font-bold text-xs rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> {downloading ? 'Downloading...' : 'Download File'}
        </button>
        <a
          href={effectiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-brand-orange font-bold text-xs rounded-2xl transition-all"
        >
          <ExternalLink className="w-4 h-4" /> Open in New Tab
        </a>
      </div>
    );
  }

  return null;
};

const LessonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [translatedTitle, setTranslatedTitle] = useState(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/student/lessons/${id}`);
        setLesson(res.data);

        // Attempt translation if student has a non-English language preference
        const lang = user?.preferredLanguage || localStorage.getItem('user_language') || 'English';
        if (lang && lang !== 'English' && res.data.content) {
          setIsTranslating(true);
          try {
            const [contentRes, titleRes] = await Promise.allSettled([
              api.post('/ai/translate', { content: res.data.content, targetLanguage: lang }),
              api.post('/ai/translate', { content: res.data.title + '\n' + (res.data.summary || ''), targetLanguage: lang })
            ]);
            if (contentRes.status === 'fulfilled') setTranslatedContent(contentRes.value.data.translatedContent);
            if (titleRes.status === 'fulfilled') {
              const lines = titleRes.value.data.translatedContent?.split('\n') || [];
              setTranslatedTitle(lines[0] || null);
            }
          } catch (e) {
            console.warn('Translation error:', e);
          } finally {
            setIsTranslating(false);
          }
        }
      } catch (err) {
        console.error('Fetch lesson detail error:', err);
        setError(err.response?.data?.message || 'Failed to load lesson. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id, user?.preferredLanguage]);

  const handleMarkComplete = async () => {
    try {
      const res = await api.post(`/student/lessons/${id}/complete`);
      setIsCompleted(true);
      setCompletionMessage(res.data.message || '✅ Lesson Complete! +15 Learning Points earned');
      if (res.data.learningPoints) {
        updateUserStats({ learningPoints: res.data.learningPoints, badges: res.data.badges });
      }
    } catch (err) {
      // Still mark complete locally even if API doesn't support endpoint yet
      setIsCompleted(true);
      setCompletionMessage('✅ Lesson marked as complete!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading lesson...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="font-bold text-lg text-red-700">Lesson Not Found</h2>
        <p className="text-sm text-red-600">{error || 'This lesson may have been removed or you may not have access.'}</p>
        <button
          onClick={() => navigate('/my-learning')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Learning
        </button>
      </div>
    );
  }

  const displayContent = translatedContent || lesson.content || '';
  const displayTitle = translatedTitle || lesson.title;

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate('/my-learning')}
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-orange bg-white px-4 py-2 rounded-2xl border border-orange-100 shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>← Back to My Learning</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-xs font-extrabold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full border border-orange-200">
            {lesson.subjectName}
          </span>
          {lesson.contentType && (
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full uppercase">
              {lesson.contentType}
            </span>
          )}
          {isTranslating && (
            <span className="text-xs font-bold text-brand-purple bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Translating...
            </span>
          )}
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-text">
          {displayTitle}
        </h1>
        {lesson.summary && (
          <p className="text-xs text-brand-muted mt-2">{lesson.summary}</p>
        )}
      </div>

      {/* File / Link / Video Content */}
      {(lesson.fileUrl || lesson.link || lesson.contentType === 'file' || lesson.contentType === 'link') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-text flex items-center gap-2">
            {lesson.contentType === 'file' ? <FileText className="w-5 h-5 text-brand-orange" /> :
             lesson.contentType === 'link' ? <LinkIcon className="w-5 h-5 text-brand-orange" /> :
             <BookOpen className="w-5 h-5 text-brand-orange" />}
            Content
          </h3>
          <FileViewer
            fileUrl={lesson.fileUrl}
            link={lesson.link}
            type={lesson.type}
            contentType={lesson.contentType}
            title={lesson.title}
          />
        </div>
      )}

      {/* Text Content Section */}
      {displayContent && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <h3 className="font-display font-bold text-lg text-brand-text flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-orange" />
              Lesson Content
            </h3>
            <VoiceMicButton textToRead={displayContent} />
          </div>
          <div className="prose text-sm text-brand-text leading-relaxed whitespace-pre-line font-medium">
            {displayContent}
          </div>
        </div>
      )}

      {/* Key Concepts (if present) */}
      {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
        <div className="bg-brand-orange-light rounded-2xl p-5 border border-orange-200 space-y-2">
          <h4 className="font-display font-bold text-base text-brand-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-orange fill-brand-orange" />
            Key Concepts
          </h4>
          <ul className="space-y-1.5 pt-1">
            {lesson.keyConcepts.map((kc, idx) => (
              <li key={idx} className="text-xs text-brand-muted font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                <span>{kc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Embedded Quiz Widget (if lesson has quiz questions) */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <QuizWidget questions={lesson.quiz} lessonId={lesson._id} />
      )}

      {/* Action Footer */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setIsAIOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-brand-orange-light hover:bg-orange-100 text-brand-orange border border-orange-300 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Mic className="w-4 h-4" />
          <span>Ask AI Tutor</span>
        </button>

        {isCompleted ? (
          <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
            {completionMessage || '✅ Lesson Complete!'}
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="w-full sm:w-auto px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Complete</span>
          </button>
        )}
      </div>

      {/* AI Tutor Modal */}
      <AITutorModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        subject={lesson.subjectName}
        lessonContext={`${lesson.chapterTitle || ''}: ${lesson.title}`}
      />
    </div>
  );
};

export default LessonDetailPage;

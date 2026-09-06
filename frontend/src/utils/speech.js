// Web Speech API Utilities & Multilingual Voice Support

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English', label: 'English (India)' },
  { code: 'hi-IN', name: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'mr-IN', name: 'Marathi', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', name: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
  { code: 'bn-IN', name: 'Bengali', label: 'বাংলা (Bengali)' },
  { code: 'ta-IN', name: 'Tamil', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', name: 'Telugu', label: 'తెలుగు (Telugu)' }
];

export const getLangCodeByName = (langName = 'English') => {
  const found = SUPPORTED_LANGUAGES.find(l => l.name.toLowerCase() === langName.toLowerCase());
  return found ? found.code : 'en-IN';
};

export const isSpeechRecognitionSupported = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const startSpeechRecognition = ({ onResult, onError, onEnd, langCode = 'en-IN' }) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('Speech Recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = langCode;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) onResult(transcript, event.results[0].isFinal);
  };

  recognition.onerror = (event) => {
    console.error('Speech Recognition Error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();
  return recognition;
};

export const speakText = (text, langCode = 'en-IN') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95; // Friendly, steady reading pace
    utterance.pitch = 1.05; // Slightly warmer pitch for children/students
    window.speechSynthesis.speak(utterance);
  }
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

const getEducationalFallbackAnswer = (question, subject, preferredLanguage) => {
  const q = question.toLowerCase();
  if (q.includes('fraction')) {
    return "Great question! When we divide or work with fractions, we are splitting a whole item into equal parts. Imagine cutting a pizza into 4 equal slices. 1 slice is 1/4 of the pie!";
  }
  if (q.includes('photosynthesis')) {
    return "Photosynthesis is how plants make food using sunlight! 🌿☀️ Plants take in light, water from soil, and carbon dioxide from air to produce glucose and oxygen.";
  }
  return `That's a wonderful question about ${subject || 'your lesson'}! Let's break it down step-by-step to understand it clearly.`;
};

const callGeminiAPI = async (prompt) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('[AI] GEMINI_API_KEY is missing from .env');
    return null;
  }

  // Use lite models - they have higher free tier quotas
  const models = ['gemini-flash-lite-latest', 'gemini-2.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (data?.error) {
        console.warn(`[AI] ${model} error ${data.error.code}: ${data.error.status}`);
        if (data.error.code === 429) continue; // quota hit, try next model
        return null;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`[AI] Success with model: ${model}`);
        return text;
      }
    } catch (err) {
      console.warn(`[AI] ${model} fetch error:`, err.message);
    }
  }

  console.error('[AI] All Gemini models exhausted quota or failed.');
  return null;
};

const askAITutor = async ({ question, subject = 'General', grade = '7', lessonContext = '', preferredLanguage = 'English' }) => {
  const prompt = `You are LearnMate AI, a friendly and encouraging educational tutor for Grade ${grade} students in India.
The student is studying: ${subject}.
${lessonContext ? `Lesson Context: ${lessonContext}` : ''}
The student asks: "${question}"

Respond in ${preferredLanguage}. Give a clear, step-by-step, encouraging answer suitable for a Grade ${grade} student. Use simple language, emojis where helpful, and examples to explain concepts. Keep it concise (3-5 sentences max).`;

  const aiResult = await callGeminiAPI(prompt);
  return aiResult || getEducationalFallbackAnswer(question, subject, preferredLanguage);
};

const askTeacherAssistant = async ({ question, classContext = '', preferredLanguage = 'English' }) => {
  const prompt = `You are an expert teaching assistant for school teachers in India.
${classContext ? `Class context: ${classContext}` : ''}
Teacher's question: "${question}"

Provide a practical, professional response in ${preferredLanguage}. Include specific strategies, examples, or templates if helpful. Be concise and actionable.`;

  const aiResult = await callGeminiAPI(prompt);
  return aiResult || `Here is a strategy for your query: Consider breaking this topic into smaller activities, using visual aids, and encouraging peer discussion among students.`;
};

const generateTeacherContent = async ({ topic, subject = 'General', grade = '7', preferredLanguage = 'English' }) => {
    const prompt = `Create a detailed educational lesson note for Grade ${grade} students on the subject of "${subject}" with the topic "${topic}".
Format it beautifully in Markdown with headings, bullet points, and clear explanations.
Do not include any introductory conversation, just the lesson content itself.`;
    const aiResult = await callGeminiAPI(prompt);
    return aiResult || `### Lesson Draft: ${topic}`;
  };

const generateTeacherAssignment = async ({ topic, subject = 'General', grade = '7', count = 5, preferredLanguage = 'English' }) => {
    const prompt = `Create an educational assignment or quiz for Grade ${grade} students on the subject of "${subject}" with the topic "${topic}".
Generate exactly ${count} questions.
Output the text in markdown format. 
Make sure it is engaging and directly usable by a teacher.`;
    const aiResult = await callGeminiAPI(prompt);
    return aiResult || `### Assignment: ${topic} Practice Worksheet`;
  };

const generateQuiz = async ({ topic, subject = 'Mathematics', count = 5, preferredLanguage = 'English' }) => {
    const prompt = `Create a multiple choice quiz for students on the subject of "${subject}" with the topic "${topic}".
Generate exactly ${count} questions.
Return ONLY a valid JSON array of objects, with NO markdown blocks or text around it. Each object must have exactly this schema:
{
  "question": "The text of the question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0, // integer index (0-3) of the correct option
  "explanation": "Short explanation of why this answer is correct"
}
`;
    const aiResult = await callGeminiAPI(prompt);
    if (aiResult) {
      try {
        let cleanText = aiResult.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
        if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
        const parsed = JSON.parse(cleanText);
        return parsed;
      } catch (e) {
        console.error('Quiz JSON parsing failed', e);
      }
    }
    return [];
  };

const translateContent = async (content, targetLanguage) => {
  if (targetLanguage === 'English') return content;
  const prompt = `Translate the following educational content into ${targetLanguage}. Maintain the formatting, tone, and markdown structure.\n\nContent:\n${content}`;
  const aiResult = await callGeminiAPI(prompt);
  return aiResult || content;
};

module.exports = { askAITutor, askTeacherAssistant, generateTeacherContent, generateTeacherAssignment, generateQuiz, translateContent };

# ?? LearnMate AI — Smart India Hackathon (SIH 2026)

**AI-Powered Student Learning & Teacher Support Platform**

LearnMate AI is an adaptive, accessible educational platform built for students and teachers across diverse educational backgrounds. It features AI tutoring, interactive quizzes, teacher content authoring, homework submission, multilingual support, and automated grading.

---

## ?? Key Features

- ?? **Multilingual AI Tutor**: Context-aware answers in English, Hindi, and regional languages.
- ?? **Interactive Quizzes**: Multiple-choice testing with instant scoring and explanation insights.
- ?? **Teacher Hub**: Create and publish lessons, notes, and AI-generated assignments & quizzes.
- ?? **Target Class & Universal Publishing**: Target specific classrooms or publish universally to all students.
- ?? **Teacher Analytics**: Real-time class score averages, submission tracking, and student performance metrics.
- ?? **Gamified Student Dashboard**: Track learning points, streaks, badges, and upcoming homework.

---

## ??? Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT Authentication
- **AI Engine**: Google Gemini API with intelligent educational fallback models
- **Deployment**: Vercel-ready with Serverless API rewrites

---

## ?? Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/siddhiranka/SIH2026.git
cd SIH2026
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5050`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` (or `5173`).*

---

## ?? Deploying to Vercel

This repository is pre-configured for seamless **one-step deployment on Vercel**.

1. Push this repository to GitHub (`https://github.com/siddhiranka/SIH2026`).
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Project**.
3. Select your repository: `siddhiranka/SIH2026`.
4. Leave the **Root Directory** as `./` (the root).
5. In **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://...`)
   - `JWT_SECRET`: A secure random secret key (e.g. `learnmate_sih_2026_super_secret`)
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key for AI Tutor
6. Click **Deploy**! ??

Vercel will automatically build the Vite frontend to `frontend/dist` and mount the Express API routes at `/api/*` via `@vercel/node`.

---

## ?? Default Demo Accounts

| Role | Email / ID | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Teacher** | `teacher@learnmate.edu` | `teacher123` | Class 7A Teacher |
| **Student** | `siddhi@learnmate.edu` | `student123` | Class 7A Student (Code: `ABC123`) |

---

## ?? License
This project was developed for the **Smart India Hackathon (SIH 2026)**.

# 🚀 AI Startup Idea Validator

An AI-powered full-stack application that analyzes startup ideas and provides structured insights like market potential, competitors, risks, and profitability.

🔗 **Live Demo**

* Frontend: https://ai-startup-validator-rho.vercel.app/
* Backend API: https://startup-validator-backend-2kme.onrender.com/

---

## 📌 Overview

This project allows users to submit a startup idea (with optional document upload) and receive an AI-generated validation report.

The system leverages:

* 🤖 AI models (HuggingFace)
* 📄 OCR for document extraction
* ⚡ FastAPI backend
* 🌐 Next.js frontend

---

## ✨ Features

### 🧠 AI Analysis

* Problem summary
* Target customer persona
* Market overview
* Competitor analysis (3 competitors)
* Suggested tech stack
* Risk level assessment
* Profitability score (0–100)

### 📄 File Upload + OCR

* Supports PDF, DOCX, and images
* Extracts text using OCR
* Merges extracted content with user input for better analysis

### 🎨 Modern UI (Sarvam-style inspired)

* Clean, minimal design
* Smooth animations (Framer Motion)
* Glassmorphism UI
* Responsive layout (laptop optimized)

### 📊 Dashboard

* View all submitted ideas
* Clean card-based UI
* Interactive experience

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* FastAPI
* HuggingFace Inference API
* Python

### OCR & Processing

* pdfplumber
* pytesseract
* python-docx

### Database

* Supabase (PostgreSQL)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## ⚙️ Installation (Local Setup)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Yamuna-6730/ai-startup-validator.git
cd ai-startup-validator
```

---

### 2️⃣ Setup Backend

```bash
cd server
python -m venv venv
venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

Create `.env`:

```env
HUGGINGFACE_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

Run backend:

```bash
uvicorn main:app --reload
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| POST   | `/ideas`      | Submit idea + AI analysis |
| GET    | `/ideas`      | Get all ideas             |
| GET    | `/ideas/{id}` | Get idea details          |

---

## 🧠 AI Prompt

```text
You are an expert startup consultant. Analyze the given startup idea
and return a structured JSON object with:

problem, customer, market, competitor,
tech_stack, risk_level, profitability_score, justification

Title: {title}
Description: {description}
{f'Context: {extracted_text}' if extracted_text else ''}
Return ONLY JSON matching this EXACT schema:
{{
  "problem": "string",
  "customer": "string",
  "market": "string",
  "competitor": ["list of 3"],
  "tech_stack": ["list of 5"],
  "risk_level": "Low/Medium/High",
  "profitability_score": 0-100,
  "justification": "string"
}
```

---

## 💡 Challenges & Learnings

* Handling HuggingFace model limitations (cold starts & deprecations)
* Implementing retry + fallback logic
* Integrating OCR pipelines with AI
* Designing clean and modern UI inspired by Sarvam AI

---

## 🚀 Future Improvements

* Add authentication (user login)
* Save user-specific ideas
* Export report as PDF
* Improve AI model accuracy
* Add real-time streaming responses

---

## 👩‍💻 Author

**Yamuna Latchipatruni**
B.Tech CSE (Data Science)
VNR Vignana Jyothi Institute of Engineering & Technology

---

## ⭐ Acknowledgements

* HuggingFace
* Supabase
* FastAPI
* Vercel & Render

---

---

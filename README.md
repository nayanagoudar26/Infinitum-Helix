# Infinitum Helix

Infinitum Helix is a full-stack AI-powered disease prediction and emergency assistance platform built with a responsive Next.js frontend and a modular FastAPI backend. It helps users log symptoms, receive ML-backed disease risk predictions, monitor local outbreak patterns, and quickly find nearby hospitals during emergencies.

## Tech Stack

- Frontend: Next.js 15, React 19, Tailwind CSS
- Backend: FastAPI, Motor, JWT authentication
- Database: MongoDB
- AI/ML: scikit-learn RandomForest with heuristic fallback
- Realtime: WebSockets for alert delivery
- Maps: Google Maps JavaScript API
- Weather: OpenWeatherMap API

## Project Structure

```text
frontend/
  app/
  components/
  lib/
backend/
  app/
    api/routes/
    core/
    db/
    schemas/
    services/
    tests/
  data/
  ml/
  scripts/
```

## Core Features

- Email/password signup and login with JWT-based session handling
- Protected dashboard with user risk level, outbreak heatmap, weather context, and daily summary
- Symptom logger with duration, intensity, timestamp, and anonymized location storage
- AI symptom chat that extracts symptom entities and returns structured disease-risk guidance
- Disease prediction engine using symptoms plus weather signals
- 7-day risk forecast using rule-based spread logic
- Weather and disease risk correlation insights
- Emergency page with nearby hospitals, estimated travel times, and emergency alert triggering
- Realtime alerts through WebSockets for high-risk predictions and severe symptom detection
- Sensitive note/message encryption and coordinate anonymization
- Sample dataset, training script, and backend tests

## Backend API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `POST /api/symptoms`
- `POST /api/chat`
- `GET /api/risk/forecast`
- `GET /api/weather`
- `GET /api/hospitals/nearby`
- `POST /api/hospitals/emergency`
- `GET /api/alerts`
- `GET /health`
- `WS /ws/{user_id}`

## Local Setup

### 1. Environment

Copy `.env.example` to `.env` and update the secrets/API keys.

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set PYTHONPATH=%cd%
python scripts/train_model.py
uvicorn app.main:app --reload --port 8000
```

PowerShell version:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:PYTHONPATH = (Get-Location).Path
python scripts/train_model.py
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and expects the backend at `http://localhost:8000`.

## Data Privacy Notes

- Passwords are hashed using bcrypt.
- Free-text notes and chat messages are encrypted before persistence.
- Stored coordinates are rounded before outbreak analytics to reduce identifiability.
- Signup includes explicit consent before health data processing.

## ML Notes

- Training data lives in `backend/data/sample_disease_data.csv`.
- Running `python scripts/train_model.py` saves model artifacts into `backend/ml/`.
- If artifacts are missing, the backend falls back to a transparent rule-based predictor so local development still works.

## Testing

```bash
cd backend
pytest app/tests -q
```

## Production Hardening Suggestions

- Move secrets to a managed secret store.
- Add refresh tokens and server-side session revocation.
- Replace the sample hospital service with Google Places API or a hospital directory feed.
- Swap the heuristic NLP extractor for spaCy or a medical NER pipeline.
- Add background jobs for scheduled outbreak aggregation and outbound notifications.

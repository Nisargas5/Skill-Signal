# SkillSignal

SkillSignal is a recruiter-ready portfolio app for exploring role requirements and comparing skills. Milestone 1 provides the React frontend, FastAPI backend, and a live backend health check. Product workflows and data models are intentionally left for later milestones.

## Stack

- Frontend: React, Vite, and TypeScript
- Backend: FastAPI and Uvicorn
- Frontend packages use npm; backend packages are isolated in `.venv`.

## Run locally (Windows PowerShell)

Use two PowerShell terminals from the project root.

### Backend
# SkillSignal

SkillSignal is a recruiter-ready portfolio app for exploring role requirements and comparing skills. Milestone 2 provides the responsive interface and clearly labeled synthetic demo data.

## Current scope

- Overview with counts and charts derived only from six synthetic role briefs
- Job Explorer with working text search and seniority filter
- Resume Analyzer input preview; text remains in browser memory and is not sent to the API
- Illustrative skill-gap page and session-only learning roadmap checklist
- Recruiter Insights based only on the synthetic sample
- Data Management summary and CSV export of the synthetic sample
- Backend connection status from `GET /api/health`

Skill matching, PDF processing, database-backed jobs, CSV import, and live market data are not implemented yet. The gap example is not a real candidate assessment. No displayed counts represent current labor-market demand.

## Stack

- Frontend: React, Vite, TypeScript, Recharts, and Lucide
- Backend: FastAPI and Uvicorn
- Backend dependencies use the project-local `.venv`; frontend dependencies use npm.

## Run locally (Windows PowerShell)

Use two PowerShell terminals from the project root.

### Backend

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

The health endpoint is `http://localhost:8000/api/health`. Local CORS allows Vite on `localhost:5173` and `127.0.0.1:5173`. Set `$env:FRONTEND_ORIGIN` before starting Uvicorn to configure an additional origin.

### Frontend

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open the URL printed by Vite. Change `VITE_API_BASE_URL` in `.env` if the API uses another URL.

## Checks

```powershell
npm run lint
npm run build
```

Check the running backend with `Invoke-RestMethod http://localhost:8000/api/health`.
  "rules": {

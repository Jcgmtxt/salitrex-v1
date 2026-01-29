# Salitrex - Workshop Management System

## Overview
Salitrex is a comprehensive management system for an automotive workshop, initially focusing on the Paint Module. It allows tracking clients, vehicles, service entries, and generating daily delivery reports.

## Architecture
The project follows a split-stack architecture, utilizing **Bun** as the primary runtime and orchestrator for the frontend.

- **Backend**: FastAPI (Python) using a Modular Monolith pattern.
- **Frontend**: React + TypeScript + **Bun** (Native integration, no Vite required).
- **Routing**: **TanStack Router** (Type-safe routing).
- **Styling**: **Tailwind CSS v4** + Shadcn/UI (Premium dark aesthetic).
- **Database**: PostgreSQL.
- **Storage**: AWS S3 (for vehicle photos/videos).

## Project Structure

```
salitrex/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── core/           # Config, Database, Security
│   │   ├── modules/        # Domain Modules (Auth, CRM, Workshop)
│   │   └── main.py         # Entry point
│   └── pyproject.toml      # Python dependencies
├── frontend/               # React Application
│   ├── src/
│   │   ├── pages/          # Page components (Home, etc.)
│   │   ├── router.tsx      # Routing configuration
│   │   ├── index.ts        # Bun server entry point (Dev & API)
│   │   └── frontend.tsx    # React client entry point
│   ├── bunfig.toml         # Bun configuration (Tailwind plugin)
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- **Python**: 3.10+
- **Bun**: Required (v1.3.5+). Install via `curl -fsSL https://bun.sh/install | bash` (Mac/Linux) or `powershell -c "irm bun.sh/install.ps1 | iex"` (Windows).
- **PostgreSQL**: Running locally or via Docker.

### 1. Backend Setup
Navigate to the `backend/` directory:
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```
Swagger UI: `http://localhost:8000/docs`

### 2. Frontend Setup
Navigate to the `frontend/` directory:
```bash
cd frontend
bun install
bun run dev
```
The application will be available at: `http://localhost:3000`

### Key Features (Implemented)
- **Native Bun Server**: Handles HMR and routing without external bundlers.
- **TanStack Router**: Type-safe navigation across the app.
- **Premium UI**: Dark-themed dashboard with hardware-accelerated animations.
- **Tailwind v4 (@theme)**: Modern CSS architecture for faster builds and better variables.

---
*This project is powered by Bun.*


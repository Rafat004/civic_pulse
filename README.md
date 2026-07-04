# CivicPulse

CivicPulse is a digital infrastructure platform designed to connect citizens directly with municipal resolution teams. It allows citizens to report issues, track their status, and enables administrators to efficiently manage and resolve civic complaints.

## Tech Stack

This project is built using a modern, separated frontend-backend architecture.

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** Tailwind CSS & shadcn/ui
- **Maps:** React Leaflet
- **Authentication:** Custom Context with HttpOnly Cookies

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database:** PostgreSQL (with pgvector/postgis)
- **ORM & Migrations:** SQLAlchemy & Alembic
- **Authentication:** JWT & Google OAuth (Authlib)

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Docker (for the database)

### 1. Database Setup
First, start the local PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```
This will start a PostgreSQL instance on port `5432` with PostGIS extensions installed.

### 2. Backend Setup
Open a new terminal and navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# On Windows
python -m venv .venv
.\.venv\Scripts\activate

# On Mac/Linux
python3 -m venv .venv
source .venv/bin/activate
```

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

Run database migrations to create the tables:
```bash
alembic upgrade head
```

Start the FastAPI backend server:
```bash
uvicorn app.main:app --reload
```
The backend will be available at `http://127.0.0.1:8000`.

### 3. Frontend Setup
Open another terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install the Node.js dependencies:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

---

## Deployment Information

This project is configured for cloud deployment:
- **Frontend:** Deployed on **Vercel**. Vercel acts as the primary domain and proxies API requests to the backend to ensure secure, first-party cookie handling.
- **Backend:** Deployed on **Railway** using Nixpacks.
- **Database:** Hosted on Railway (PostgreSQL).

### Environment Variables
For production deployment, ensure the following environment variables are set:

**Vercel (Frontend):**
- `NEXT_PUBLIC_API_URL`: Should be completely empty or removed (the `next.config.ts` proxy handles routing automatically).

**Railway (Backend):**
- `FRONTEND_URL`: Your Vercel production URL (e.g., `https://civic-pulse-roan.vercel.app`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth
- `DB_URL`: Production PostgreSQL connection string
- `SECRET_KEY`: A secure random string for JWT encoding

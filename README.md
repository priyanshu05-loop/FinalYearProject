# AI Interview System

An end-to-end interview assessment platform powered by AI. Candidates upload resumes, answer AI-generated questions, and receive detailed feedback based on speech analysis, facial expressions, and content evaluation.

## 🚀 Quick Start

Get started in 5 minutes: [QUICK_START.md](QUICK_START.md)

## 📋 Status

| Week | Feature | Status |
|------|---------|--------|
| **Week 1** | Backend API, React Frontend, JWT Auth | ✅ Complete |
| **Week 2** | Resume Upload, Skill Extraction, Interview Setup | ✅ Complete |
| **Week 3** | AI Resume Interview Generator | ✅ Complete |
| **Week 4** | Interview Flow Refinement & Candidate Practice | ✅ Complete |
| **Week 5** | Results Dashboard, Report Generation | ⏳ Planned |
| **Week 6** | Production Deployment, Performance Optimization | ⏳ Planned |

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + TailwindCSS |
| **Backend** | Node.js + Express + MongoDB |
| **Task Queue** | Celery + Redis |
| **LLM** | Claude 3 Sonnet (Anthropic API) |
| **PDF Parsing** | pdfplumber |
| **Async Tasks** | Celery + Beat Scheduler |
| **Speech-to-Text** | OpenAI Whisper (Week 3) |
| **Face Analysis** | MediaPipe + face-api.js (Week 4) |
| **Deployment** | Docker + Docker Compose |

## Project Structure

```
finalyearproject/
├── backend/                    # Django REST API
│   ├── config/                 # Django settings & config
│   ├── apps/
│   │   ├── users/              # User authentication & profiles
│   │   ├── interviews/         # Interview sessions & questions
│   │   ├── resume/             # Resume parsing & skill extraction
│   │   └── ai_service/         # AI task orchestration & tracking
│   ├── utils/
│   │   ├── pdf_parser.py       # PDF text extraction & section detection
│   │   ├── claude_ai.py        # Claude API integration
│   │   └── tasks.py            # Celery async tasks
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Login & Register
│   │   │   ├── resume/         # Resume Upload
│   │   │   ├── interview/      # Interview Setup & Recording
│   │   │   ├── dashboard/      # Main Dashboard
│   │   │   ├── profile/        # User Profile
│   │   │   └── results/        # Results & Reports
│   │   ├── services/           # API client (Axios)
│   │   ├── stores/             # Zustand state management
│   │   ├── styles/             # CSS/Tailwind
│   │   ├── App.tsx             # Main routing
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml          # Local development with all services
├── QUICK_START.md              # Quick setup guide (5 min)
├── WEEK2_GUIDE.md              # Detailed Week 2 documentation
├── README.md                   # This file
└── .gitignore

```

## Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose
- Claude API key from [Anthropic](https://console.anthropic.com/)

### Setup

1. **Clone and navigate to project:**
   ```bash
   cd finalyearproject
   ```

2. **Create environment files:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Update `.env` with your Claude API key:**
   ```bash
   CLAUDE_API_KEY=sk-ant-your-api-key-here
   ```

4. **Start all services:**
   ```bash
   docker-compose up -d
   ```

5. **Create superuser (admin):**
   ```bash
   docker-compose exec django python manage.py createsuperuser
   ```

6. **Access the application:**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:8000/api/
   - **API Docs (Swagger):** http://localhost:8000/api/docs/
   - **Django Admin:** http://localhost:8000/admin/

### Stop services:
```bash
docker-compose down
```

## Manual Setup (Without Docker)

### Backend

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Initialize database:**
   ```bash
   python manage.py migrate
   python manage.py createcachetable
   ```

5. **Run Django server:**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

6. **Run Celery worker (in another terminal):**
   ```bash
   celery -A config worker -l info
   ```

### Frontend

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/login/` - Login with email & password
- `POST /api/users/register/` - Register new user
- `POST /api/users/logout/` - Logout
- `POST /api/users/login/refresh/` - Refresh JWT token

### User Management
- `GET /api/users/me/` - Get current user
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update profile
- `PUT /api/users/change-password/` - Change password

### Resume
- `POST /api/resume/` - Upload resume
- `GET /api/resume/` - Get user's resume

### Interviews
- `POST /api/interviews/sessions/` - Create interview session
- `GET /api/interviews/sessions/` - List user's sessions
- `GET /api/interviews/sessions/{id}/` - Get session details
- `GET /api/interviews/sessions/{id}/report/` - Get session report
- `POST /api/interviews/questions/` - Get questions
- `POST /api/interviews/questions/{id}/submit/` - Submit answer

### AI Services
- `POST /api/ai/generate-questions/` - Generate interview questions
- `GET /api/ai/tasks/{id}/` - Check AI task status

See [API Documentation](http://localhost:8000/api/docs/) for full details.

## Database Schema

Key tables:
- `users_custom_user` - User accounts
- `interviews_job_role` - Job positions
- `interviews_session` - Interview sessions
- `interviews_question` - Interview questions
- `interviews_answer` - Candidate answers
- `interviews_speech_analysis` - Speech metrics
- `interviews_face_analysis` - Facial expression data
- `interviews_nlp_evaluation` - Content evaluation
- `interviews_session_report` - Final reports
- `resume_resume` - Resume data

## Week 1 & 2 Milestones

### ✅ Week 1 Completed
- Project structure & configuration
- Django models & database schema
- Authentication (JWT-based login/register)
- React frontend with routing
- Docker setup for local development
- API documentation (Swagger)
- User profile management

### ✅ Week 2 Completed
- **Resume Upload** - PDF drag-and-drop interface
- **PDF Parsing** - Extract text from PDF files using pdfplumber
- **Skill Extraction** - Claude AI analyzes resume and extracts:
  - Technical skills
  - Soft skills
  - Programming languages & frameworks
  - Years of experience
  - Education & certifications
- **Job Role Management** - Browse available positions
- **Interview Creation** - Auto-generate 6 personalized questions:
  - Based on resume skills & experience
  - Matched to job role requirements
  - Difficulty scaled to candidate level
- **Async Task Processing** - Celery for background operations:
  - Resume parsing
  - Question generation
  - Task status tracking
- **Frontend Resume Dashboard** - Display:
  - Extracted skills as badges
  - Experience summary
  - Education details
  - Interview readiness status

### ⏳ Week 3 (Next: Video & Speech Analysis)
- Video recording interface
- Audio capture with MediaRecorder API
- Speech-to-text with Whisper API
- Transcription display
- Answer recording UI
- Video upload to S3

### ⏳ Future Weeks
- Real-time speech analysis
- Facial expression recognition
- Answer evaluation
- Results dashboard
- Production deployment

## Key Features Implemented

### Backend APIs (Week 2)
```
Resume Management:
  POST   /api/resume/                - Upload new resume
  GET    /api/resume/                - List resumes
  GET    /api/resume/{id}/           - Get resume details
  GET    /api/resume/current/        - Get latest resume

Job Roles:
  GET    /api/interviews/job-roles/  - List available positions
  GET    /api/interviews/job-roles/{id}/ - Role details

Interview Sessions:
  POST   /api/interviews/sessions/        - Create session
  GET    /api/interviews/sessions/        - List sessions
  GET    /api/interviews/sessions/{id}/   - Session details
  POST   /api/interviews/sessions/{id}/start/ - Start interview

Questions & Answers:
  GET    /api/interviews/questions/  - Get questions
  POST   /api/interviews/answers/    - Submit answer
```

### Frontend Pages (Week 2)
```
/login                - User login
/register             - User registration
/dashboard            - Interview dashboard
/resume               - Resume upload & display
/interview/new        - Job role selection
/interview/:id        - Interview session (coming Week 3)
/results/:id          - Results & feedback (coming Week 5)
```

### AI Integration
- Claude 3 Sonnet for:
  - Skill extraction from resumes
  - Question generation (technical, behavioral, scenario)
  - Answer evaluation
  - Report generation
- pdfplumber for PDF parsing
- Celery for async processing with retry logic

## Development Workflow

1. **Feature branches:**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Run tests:**
   ```bash
   pytest backend/
   npm run test frontend/
   ```

4. **Code formatting:**
   ```bash
   black backend/
   isort backend/
   prettier frontend/src
   ```

## Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in production
- [ ] Update `SECRET_KEY` to a secure random value
- [ ] Configure `ALLOWED_HOSTS` for your domain
- [ ] Setup HTTPS/SSL
- [ ] Configure database backups
- [ ] Setup log aggregation
- [ ] Configure email service for notifications
- [ ] Setup monitoring (Sentry, DataDog, etc.)
- [ ] Configure CloudFlare or CDN for static files
- [ ] Setup automated tests in CI/CD

### Recommended Hosting
- **Frontend:** Vercel, Netlify
- **Backend API:** Render, Railway, Heroku
- **Database:** AWS RDS, Render PostgreSQL
- **Cache:** Upstash Redis, AWS ElastiCache
- **Storage:** AWS S3, Cloudinary

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 8000
lsof -i :8000
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose exec django python manage.py migrate zero
docker-compose exec django python manage.py migrate
```

### Redis Connection Issues
```bash
# Check Redis is running
docker-compose logs redis

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

This project is part of a Final Year Project and is not licensed for distribution.

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Review API docs at `http://localhost:8000/api/docs/`
3. Check Django admin for data inspection
4. Review server logs: `docker-compose logs django`

## Next Steps

After Week 1 setup:
1. Implement resume upload & parsing
2. Setup Claude API integration for question generation
3. Build interview session UI with webcam/mic recording
4. Implement speech-to-text with Whisper
5. Add face analysis with MediaPipe
6. Build NLP-based answer evaluation
7. Create comprehensive results dashboard
8. Deploy to production

---

**Created:** August 2026
**Version:** 0.1.0 (Week 1 - Foundation)

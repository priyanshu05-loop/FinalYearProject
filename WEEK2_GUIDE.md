# Week 2 Implementation Guide

## Resume Upload & Skill Extraction

Week 2 focuses on implementing the resume module with Claude AI-powered skill extraction and job role-based interview creation.

### What's New in Week 2

#### Backend Features
✅ **Resume Upload** - PDF file upload with validation
✅ **PDF Parsing** - Extract text from PDF using pdfplumber
✅ **Skill Extraction** - Claude AI analyzes resume and extracts skills
✅ **Job Role Management** - List and filter job roles
✅ **Interview Creation** - Create sessions and auto-generate questions
✅ **Celery Tasks** - Async processing for heavy operations

#### Frontend Features
✅ **Resume Upload Page** - Drag-and-drop resume upload
✅ **Resume Display** - Show extracted skills, experience, education
✅ **Job Role Selection** - Browse and select interview positions
✅ **Interview Setup** - Create and start interview sessions
✅ **Navigation** - Updated navbar with resume and interview links

### New Endpoints

#### Resume Management
```
POST   /api/resume/                    - Upload new resume
GET    /api/resume/                    - List user's resumes
GET    /api/resume/{id}/               - Get resume details
DELETE /api/resume/{id}/               - Delete resume
GET    /api/resume/current/            - Get latest resume
POST   /api/resume/extract-text/       - Extract text from PDF (testing)
```

#### Job Roles
```
GET    /api/interviews/job-roles/      - List all job roles
GET    /api/interviews/job-roles/{id}/ - Get job role details
```

#### Interview Sessions
```
POST   /api/interviews/sessions/            - Create new session
GET    /api/interviews/sessions/            - List user's sessions
GET    /api/interviews/sessions/{id}/       - Get session details
PUT    /api/interviews/sessions/{id}/       - Update session
DELETE /api/interviews/sessions/{id}/       - Delete session
POST   /api/interviews/sessions/{id}/start/ - Start interview
POST   /api/interviews/sessions/{id}/complete/ - Complete interview
```

#### Questions & Answers
```
GET    /api/interviews/questions/      - List questions (filtered by session)
GET    /api/interviews/questions/{id}/ - Get question details
POST   /api/interviews/answers/        - Submit answer
GET    /api/interviews/answers/        - List user's answers
```

### Installation & Setup

#### 1. Add Required Dependencies

The backend requirements already include:
- `pdfplumber` - PDF text extraction
- `anthropic` - Claude API client
- `django-celery-beat` - Async task scheduler
- `redis` - Task queue & cache

No additional pip installs needed!

#### 2. Database Migrations

Run migrations to create new tables:

```bash
# Docker
docker-compose exec django python manage.py migrate

# Manual
python manage.py migrate
```

This creates tables for:
- `resume_resume` - Resume storage
- `interviews_job_role` - Job positions
- Updated `interviews_session`, `interviews_question`, `interviews_answer`
- `ai_service_aitask` - AI task tracking

#### 3. Create Sample Job Roles

```bash
# Using Django shell
docker-compose exec django python manage.py shell
```

Then in the shell:
```python
from apps.interviews.models import JobRole

# Software Engineer
JobRole.objects.create(
    title='Software Engineer',
    description='Build and maintain backend services',
    required_skills=['Python', 'Django', 'PostgreSQL'],
    preferred_skills=['Docker', 'Kubernetes', 'AWS'],
    experience_level='mid',
    difficulty_score=6.5
)

# Product Manager
JobRole.objects.create(
    title='Product Manager',
    description='Lead product strategy and roadmap',
    required_skills=['Product Strategy', 'Data Analysis', 'Leadership'],
    preferred_skills=['Agile', 'User Research', 'Analytics'],
    experience_level='mid',
    difficulty_score=7.0
)

# Data Scientist
JobRole.objects.create(
    title='Data Scientist',
    description='Build ML models and analytics pipelines',
    required_skills=['Python', 'Machine Learning', 'SQL'],
    preferred_skills=['Deep Learning', 'Apache Spark', 'GCP'],
    experience_level='senior',
    difficulty_score=8.0
)

# Frontend Engineer
JobRole.objects.create(
    title='Frontend Engineer',
    description='Build responsive web applications',
    required_skills=['JavaScript', 'React', 'CSS'],
    preferred_skills=['TypeScript', 'Next.js', 'Redux'],
    experience_level='mid',
    difficulty_score=6.0
)
```

#### 4. Celery Worker Setup

The Docker Compose already includes Celery. For manual setup:

```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start Celery Worker
celery -A config worker -l info

# Terminal 3: Start Celery Beat (for scheduled tasks)
celery -A config beat -l info
```

### User Workflow

#### 1. Upload Resume
1. User navigates to **Resume** tab in navbar
2. Drags and drops PDF or selects file
3. Backend validates and uploads file
4. Celery task extracts text and calls Claude API
5. Skills, experience, education extracted and stored
6. Resume page displays extracted information

#### 2. Create Interview Session
1. User navigates to **Interview** tab
2. Clicks "Start an Interview"
3. Selects from available job roles
4. Creates new session (Celery generates questions asynchronously)
5. System auto-generates 6 personalized questions based on:
   - Selected job role
   - User's skills from resume
   - Experience level
   - Difficulty matching experience

#### 3. View Interview Questions
1. Session status changes to "in_progress"
2. User sees list of 6 generated questions
3. Can read question, expected answer points, and time limit
4. Ready to answer each question

### Key Files Added

**Backend Services:**
- `backend/utils/pdf_parser.py` - PDF parsing with pdfplumber
- `backend/utils/claude_ai.py` - Claude API integration
- `backend/utils/tasks.py` - Celery async tasks
- `backend/apps/resume/serializers.py` - Resume serializers
- `backend/apps/interviews/serializers.py` - Interview serializers

**Frontend Components:**
- `frontend/src/pages/resume/ResumeUploadPage.tsx` - Resume upload UI
- `frontend/src/pages/interview/InterviewSetupPage.tsx` - Job role selection
- Updated `frontend/src/components/Navbar.tsx` - Navigation links

**Migrations:**
- `backend/apps/*/migrations/` - Database schema updates

### Claude API Configuration

Ensure your `backend/.env` has:

```env
CLAUDE_API_KEY=sk-ant-your-actual-key
CLAUDE_MODEL=claude-3-sonnet-20240229
```

The service uses Claude 3 Sonnet for:
- Skill extraction from resumes
- Question generation
- Answer evaluation
- Session report generation

### Testing the Implementation

#### 1. Create Test Account
```bash
# Open http://localhost:5173/register
# Create new account
# Login
```

#### 2. Test Resume Upload
```bash
# Navigate to /resume
# Upload a PDF resume (use a real one or create test.pdf)
# Wait for async extraction
# Verify extracted skills appear
```

#### 3. Test Interview Creation
```bash
# Navigate to /interview/new
# Select a job role
# Click "Create Interview Session"
# Verify questions are generated
```

#### 4. Monitor Celery Tasks
```bash
# Check Celery logs:
docker-compose logs celery

# Or use Celery Flower (optional UI):
pip install flower
celery -A config events --broker=redis://localhost:6379
```

### Async Processing Details

**Resume Parsing (parse_and_extract_resume task):**
1. File uploaded to Django FileField
2. Celery task triggered
3. PDF text extracted using pdfplumber
4. Text sections identified
5. Claude API called for structured extraction
6. Data stored in Resume model
7. User notified via UI updates

**Question Generation (generate_interview_questions task):**
1. Interview session created
2. Celery task fetches user's resume
3. Prepares prompt with skills and role
4. Claude API generates 6 questions
5. Questions stored in database
6. Session status updated to "in_progress"

**Error Handling:**
- Tasks retry up to 3 times with exponential backoff
- Failed tasks logged to database (AITask model)
- User informed of failures via error messages

### Troubleshooting

#### Resume Upload Fails
```
Problem: "File upload error" or "Invalid PDF"
Solution: 
  - Check file is valid PDF
  - Check file size < 10MB
  - Check API permissions in settings
```

#### Questions Not Generating
```
Problem: Questions not appearing after session creation
Solution:
  - Check Celery worker is running: docker-compose logs celery
  - Verify Claude API key in .env
  - Check AITask table for failed tasks: /admin/ai_service/aitask/
  - Restart Celery: docker-compose restart celery
```

#### Skill Extraction Incorrect
```
Problem: Extracted skills don't match resume
Solution:
  - Try different resume format (convert to PDF)
  - Check raw text extraction: POST /api/resume/extract-text/
  - Verify Claude API response in Celery logs
```

#### CORS Errors
```
Problem: "Access to XMLHttpRequest denied"
Solution:
  - Check CORS_ALLOWED_ORIGINS in backend/.env
  - Restart backend: docker-compose restart django
  - Clear browser cache
```

### Performance Considerations

- **PDF Parsing:** ~2-5 seconds per file
- **Claude API:** ~3-10 seconds for skill extraction, ~15-30 seconds for questions
- **Database:** Indexes on user_id, session_id, status for fast queries
- **Caching:** Consider caching job roles (rarely change)

### Security Notes

1. **File Upload:** Only PDF files allowed, max 10MB
2. **API Keys:** Claude API key stored in environment variables
3. **Resume Data:** Associated with user, only accessible to owner
4. **Sessions:** Users can only access their own interview sessions

### Next Steps (Week 3)

After Week 2 completion, you'll implement:

1. **Video/Audio Recording** - MediaRecorder API
2. **Speech-to-Text** - Whisper API for transcription
3. **Answer Recording UI** - Show timer, recorder controls
4. **Submit Answers** - With video/audio to S3
5. **Real-time Transcription** - Process audio during interview

### Database Schema Overview

```
User (1) ──→ (1) Resume
User (1) ──→ (N) InterviewSessions
User (1) ──→ (N) JobRole (many-to-many possible)

InterviewSession (1) ──→ (N) Questions
InterviewSession (1) ──→ (1) SessionReport

Question (1) ──→ (1) Answer
Answer (1) ──→ (0-1) SpeechAnalysis
Answer (1) ──→ (0-1) FaceAnalysis
Answer (1) ──→ (0-1) NLPEvaluation

AITask (tracks all async operations)
```

---

**Status:** Week 2 Implementation Complete ✅
**Frontend:** http://localhost:5173
**Backend:** http://localhost:8000/api/
**Admin:** http://localhost:8000/admin/
**Docs:** http://localhost:8000/api/docs/

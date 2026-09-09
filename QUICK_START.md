# Quick Start Guide - Week 2

Get your AI Interview System up and running in 5 minutes!

## Prerequisites

- Docker & Docker Compose installed
- Claude API key from Anthropic
- Git for version control

## Quick Setup

### 1. Environment Configuration (2 min)

```bash
cd d:\finalyearproject

# Backend environment
cat > backend/.env << 'EOF'
DEBUG=True
SECRET_KEY=django-insecure-dev-key-super-secret
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=ai_interview
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432

# Celery & Redis
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1

# Claude API
CLAUDE_API_KEY=sk-ant-YOUR_ACTUAL_API_KEY_HERE
CLAUDE_MODEL=claude-3-sonnet-20240229

# File Storage
MEDIA_URL=/media/
MEDIA_ROOT=/app/media/

# JWT
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_HOURS=24
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
EOF

# Frontend environment
cat > frontend/.env << 'EOF'
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
EOF
```

### 2. Start Services (1 min)

```bash
# Start all services in background
docker-compose up -d

# Wait for services to be ready (watch logs)
docker-compose logs -f

# Expected output: "Django app ready", "Celery worker ready", "Frontend running"
```

### 3. Initialize Database (1 min)

```bash
# Run migrations
docker-compose exec django python manage.py migrate

# Create superuser (admin)
docker-compose exec django python manage.py createsuperuser
# Follow prompts: username, email, password

# Load sample job roles (optional)
docker-compose exec django python manage.py loaddata sample_roles
```

### 4. Add Sample Job Roles (1 min)

```bash
docker-compose exec django python manage.py shell
```

Paste this code:
```python
from apps.interviews.models import JobRole

roles = [
    {
        'title': 'Backend Engineer',
        'description': 'Build scalable APIs and services',
        'required_skills': ['Python', 'Django', 'PostgreSQL', 'REST API'],
        'experience_level': 'mid',
        'difficulty_score': 6.5
    },
    {
        'title': 'Frontend Engineer', 
        'description': 'Create beautiful user interfaces',
        'required_skills': ['JavaScript', 'React', 'TypeScript', 'CSS'],
        'experience_level': 'mid',
        'difficulty_score': 6.0
    },
    {
        'title': 'Data Scientist',
        'description': 'Build ML models and analytics',
        'required_skills': ['Python', 'Machine Learning', 'SQL', 'Statistics'],
        'experience_level': 'senior',
        'difficulty_score': 8.0
    }
]

for role_data in roles:
    JobRole.objects.create(**role_data)

print("✅ Sample job roles created!")
exit()
```

### 5. Access the Application

| Component | URL | Credentials |
|-----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Register new account |
| **Backend Admin** | http://localhost:8000/admin | Use superuser account |
| **API Docs** | http://localhost:8000/api/docs | Auto-generated Swagger |
| **ReDoc** | http://localhost:8000/api/redoc | Alternative docs |

## Testing the Complete Flow

### Step 1: Create Account
1. Go to http://localhost:5173
2. Click "Sign up here" or go to /register
3. Fill form:
   - First Name: John
   - Last Name: Doe
   - Username: johndoe
   - Email: john@example.com
   - Password: SecurePass123!
   - Role: Candidate

### Step 2: Login
1. Click "Sign in here"
2. Use your email and password

### Step 3: Upload Resume
1. Click **Resume** in navbar
2. Download a sample resume or use one you have (must be PDF)
3. Drag it to the upload area or click to select
4. Wait for processing (you'll see a spinner)
5. Verify extracted skills appear

### Step 4: Create Interview
1. Click **Interview** in navbar
2. Select a job role (e.g., "Backend Engineer")
3. Click **Create Interview Session**
4. Wait for questions to generate (check Celery logs)
5. Verify 6 questions appear with:
   - Question text
   - Expected answer points
   - Time limit (30-120 seconds)

### Step 5: Monitor Background Tasks
```bash
# In another terminal, watch Celery worker
docker-compose logs -f celery

# You should see:
# [tasks.parse_and_extract_resume] Started
# [tasks.generate_interview_questions] Started
# Task completion messages
```

## Common Issues & Fixes

### "Cannot connect to database"
```bash
# Check postgres is running
docker-compose logs postgres

# Restart all services
docker-compose restart
```

### "Claude API error" in logs
```bash
# Verify API key in backend/.env
echo $CLAUDE_API_KEY

# Check it's set correctly:
docker-compose exec django python -c "import os; print(os.environ.get('CLAUDE_API_KEY'))"
```

### "Celery tasks not running"
```bash
# Check Celery worker is running
docker-compose logs celery

# Restart if needed
docker-compose restart celery

# Verify Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Resume upload stuck
```bash
# Check file size (max 10MB)
ls -lh ~/Documents/resume.pdf

# Try with test file:
# Create a simple PDF and retry
```

## Useful Docker Commands

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f django
docker-compose logs -f celery
docker-compose logs -f postgres

# Restart specific service
docker-compose restart django

# Connect to Django shell
docker-compose exec django python manage.py shell

# Run management command
docker-compose exec django python manage.py [command]

# Backup database
docker-compose exec postgres pg_dump -U postgres ai_interview > backup.sql

# Stop all services
docker-compose down

# Remove all data (fresh start)
docker-compose down -v
```

## Performance Testing

### Test Resume Upload
```bash
# Time how long resume parsing takes
# Watch logs: docker-compose logs -f celery
# Upload resume, should complete in ~5-10 seconds
```

### Test Question Generation
```bash
# Time how long questions generate
# Create interview session, watch logs
# Should complete in ~20-30 seconds (Claude API latency)
```

## Next Steps

1. ✅ Week 2 Complete (Resume + Interview Setup)
2. ⏳ Week 3: Video/Audio Recording
3. ⏳ Week 4: Real-time Analysis (Speech, Face)
4. ⏳ Week 5: Results & Reports
5. ⏳ Week 6: Production Deployment

## Useful Resources

- **API Documentation:** http://localhost:8000/api/docs
- **Django Admin:** http://localhost:8000/admin
- **Celery Logs:** `docker-compose logs celery`
- **Database Console:** `docker-compose exec postgres psql -U postgres ai_interview`

## Troubleshooting Commands

```bash
# Check if services are running
docker-compose ps

# Full system diagnosis
docker-compose logs --tail=50

# Clear Redis cache (if stuck)
docker-compose exec redis redis-cli FLUSHALL

# Reset database (caution: deletes all data)
docker-compose down -v
docker-compose up -d
docker-compose exec django python manage.py migrate
```

---

**Everything working?** Proceed to Week 3: Video Recording & Speech Analysis! 🚀

For detailed Week 2 features, see [WEEK2_GUIDE.md](WEEK2_GUIDE.md)

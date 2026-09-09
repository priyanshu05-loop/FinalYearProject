# Setup Guide - AI Interview System

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Claude API key from [Anthropic Console](https://console.anthropic.com/)

### Step 1: Add Claude API Key
Edit `backend/.env` and replace:
```
CLAUDE_API_KEY=sk-ant-your-api-key-here
```
with your actual Claude API key.

### Step 2: Start Services
```bash
cd finalyearproject
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Django API (port 8000)
- React Frontend (port 5173)
- Celery Worker (background tasks)

### Step 3: Initialize Database
```bash
docker-compose exec django python manage.py migrate
docker-compose exec django python manage.py createcachetable
```

### Step 4: Create Admin Account
```bash
docker-compose exec django python manage.py createsuperuser
# Follow prompts to create admin account
```

### Step 5: Access Application
- **Frontend:** http://localhost:5173
  - Click "Register" to create a test account
  - Login with your credentials

- **API Docs:** http://localhost:8000/api/docs/
  - Try endpoints with Swagger UI
  - Authentication: Click "Authorize", then login first

- **Django Admin:** http://localhost:8000/admin/
  - Login with superuser account created in Step 4
  - View/manage all database records

## Manual Setup (Without Docker)

### Backend Setup

#### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Setup PostgreSQL Database
```bash
# Install PostgreSQL if not already installed
# Then create database:
createdb ai_interview_db
```

#### 4. Update Environment
Backend `.env` is already configured for local development.
If using different DB credentials, update:
```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
```

#### 5. Run Migrations
```bash
python manage.py migrate
python manage.py createcachetable
```

#### 6. Create Superuser
```bash
python manage.py createsuperuser
```

#### 7. Start Django Server
```bash
python manage.py runserver 0.0.0.0:8000
```

#### 8. Start Celery (in new terminal)
```bash
# Activate virtual environment first
celery -A config worker -l info
```

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Start Dev Server
```bash
npm run dev
```

Frontend will open at http://localhost:5173

## First Time Usage

### 1. Register Account
- Go to http://localhost:5173/register
- Fill in form with:
  - First name
  - Last name  
  - Email
  - Username
  - Password
- Click "Create account"

### 2. Login
- Go to http://localhost:5173/login
- Use email and password from registration
- Click "Sign in"

### 3. Access Dashboard
After login, you're redirected to dashboard (coming soon placeholder).

### 4. Test API Endpoints
- Go to http://localhost:8000/api/docs/
- Click "Authorize" button
- Login with your credentials
- Try out any endpoint (green buttons show GET, blue shows POST, etc.)

## Verify Everything Works

### 1. Check Backend
```bash
curl http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Check Database
```bash
# Docker:
docker-compose exec postgres psql -U postgres -d ai_interview_db

# Manual:
psql -U postgres -d ai_interview_db
```

### 3. Check Redis
```bash
# Docker:
docker-compose exec redis redis-cli

# Manual:
redis-cli
```

## Useful Commands

### Docker Commands
```bash
# View logs
docker-compose logs django
docker-compose logs frontend
docker-compose logs celery

# Stop services
docker-compose down

# Restart specific service
docker-compose restart django

# Remove all data (WARNING: destructive)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

### Django Commands
```bash
# Create migrations for changes
python manage.py makemigrations

# Run pending migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django shell
python manage.py shell

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test

# Clear cache
python manage.py clear_cache
```

### Database Commands
```bash
# Access psql
psql -U postgres -d ai_interview_db

# List tables
\dt

# Describe table
\d table_name

# Exit
\q
```

## Common Issues & Solutions

### Issue: "Connection refused" on port 5432
**Solution:** PostgreSQL not running
```bash
# Docker: Make sure postgres service is running
docker-compose ps postgres

# Manual: Start PostgreSQL service
# Windows: services.msc, find PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Issue: "Connection refused" on port 6379
**Solution:** Redis not running
```bash
# Docker: 
docker-compose restart redis

# Manual: Start Redis
redis-server
```

### Issue: "ModuleNotFoundError: No module named 'django'"
**Solution:** Virtual environment not activated
```bash
# Make sure you're in backend directory
cd backend

# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Then try command again
python manage.py runserver
```

### Issue: "Port already in use"
**Solution:** Kill process using port
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

### Issue: "CORS error" in frontend
**Solution:** Make sure Django is running on correct host
```bash
# Check backend/.env has:
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Restart Django:
python manage.py runserver 0.0.0.0:8000
```

## Next Steps

After setup is complete:

1. **Week 1 (Completed):**
   - ✅ Project structure
   - ✅ Authentication
   - ✅ Database schema

2. **Week 2 (Ready for implementation):**
   - Resume upload & parsing
   - Skill extraction with Claude API
   - Resume dashboard

3. **Week 3:**
   - Question generation
   - Interview session setup

4. **Later weeks:**
   - Recording with MediaRecorder API
   - Speech-to-text with Whisper
   - Face analysis with MediaPipe
   - Answer evaluation with NLP
   - Results dashboard

## Getting Help

1. Check logs:
   ```bash
   docker-compose logs django
   docker-compose logs frontend
   ```

2. Check API docs:
   - Swagger UI: http://localhost:8000/api/docs/
   - ReDoc: http://localhost:8000/api/redoc/

3. Access Django shell:
   ```bash
   python manage.py shell
   from apps.users.models import CustomUser
   CustomUser.objects.all()
   ```

4. Reset database (if needed):
   ```bash
   docker-compose exec django python manage.py migrate zero apps.users
   docker-compose exec django python manage.py migrate
   ```

---

**Need help?** Review the [README.md](./README.md) for more details about the project architecture and API endpoints.

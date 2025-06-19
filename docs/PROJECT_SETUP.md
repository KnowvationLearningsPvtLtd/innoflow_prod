# InnoFlow Project Setup Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Overview](#project-overview)
- [Database Setup (PostgreSQL)](#database-setup-postgresql)
- [Backend Setup (Django)](#backend-setup-django)
- [Frontend Setup (Next.js)](#frontend-setup-nextjs)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 14+** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Redis** - [Download Redis](https://redis.io/download) (for Celery task queue)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Optional but Recommended
- **pgAdmin** - PostgreSQL administration tool
- **VS Code** - Code editor with Python and TypeScript extensions
- **Postman** - API testing tool

## 🏗️ Project Overview

InnoFlow is a full-stack AI workflow platform with:
- **Backend**: Django REST API with PostgreSQL
- **Frontend**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Authentication**: NextAuth.js with Google and GitHub OAuth
- **Task Queue**: Celery with Redis
- **AI Integration**: OpenAI, Anthropic, Gemini, DeepSeek, HuggingFace, Ollama

### Project Structure
```
know/
├── frontend/           # Next.js application
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities and API clients
│   └── public/        # Static assets
├── backend/           # Django application
│   ├── InnoFlow/      # Main Django project
│   ├── users/         # User management app
│   ├── workflows/     # Workflow management app
│   └── manage.py      # Django management script
└── docs/              # Documentation
```

## 🗄️ Database Setup (PostgreSQL)

### 1. Install PostgreSQL

#### Windows
```bash
# Download installer from https://www.postgresql.org/download/windows/
# During installation, remember your postgres user password
```

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Or on Windows, use Command Prompt:
psql -U postgres
```

In the PostgreSQL shell:
```sql
-- Create database
CREATE DATABASE innoflow_db;

-- Create user
CREATE USER innoflow_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE innoflow_db TO innoflow_user;
ALTER USER innoflow_user CREATEDB;

-- Exit PostgreSQL shell
\q
```

### 3. Verify Database Connection
```bash
psql -h localhost -U innoflow_user -d innoflow_db
```

## 🐍 Backend Setup (Django)

### 1. Clone Repository
```bash
git clone https://github.com/KnowvationLearningsPvtLtd/innoflow_prod.git
cd know
```

### 2. Create Virtual Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create Environment File
Create `.env` file in the `backend` directory:
```env
# Django Configuration
SECRET_KEY=your-super-secret-django-key-50-chars-minimum
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=innoflow_db
DB_USER=innoflow_user
DB_PASSWORD=your_secure_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google OAuth (Django Allauth)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# GitHub OAuth (Django Allauth)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Social Auth (Alternative authentication backend)
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your_google_oauth_client_id
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your_google_oauth_client_secret
SOCIAL_AUTH_GITHUB_KEY=your_github_oauth_client_id
SOCIAL_AUTH_GITHUB_SECRET=your_github_oauth_client_secret

# Celery Configuration
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Email Configuration (Development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@innoflow.com
```

### 5. Run Database Migrations
```bash
# Make sure you're in the backend directory with activated virtual environment
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Test Backend
```bash
python manage.py runserver
```
Visit: http://localhost:8000/admin/

## ⚛️ Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Create Environment File
Create `.env.local` file in the `frontend` directory:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-32-chars-minimum

# Backend API Connection
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth (for NextAuth)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# GitHub OAuth (for NextAuth)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Public OAuth Client IDs (for client-side components)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_oauth_client_id

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_VECTOR_STORES=true
NEXT_PUBLIC_ENABLE_MULTI_AGENT=true

# Development
NODE_ENV=development
```

### 4. Test Frontend
```bash
npm run dev
```
Visit: http://localhost:3000

## 🔐 Environment Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (NextAuth)
   - `http://localhost:8000/accounts/google/login/callback/` (Django Allauth)
6. Copy Client ID and Client Secret to your `.env` files

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Application details:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URLs:
     - `http://localhost:3000/api/auth/callback/github` (NextAuth)
     - `http://localhost:8000/accounts/github/login/callback/` (Django Allauth)
4. Copy Client ID and Client Secret to your `.env` files

### AI Provider API Keys

Configure these through the Django admin panel at http://localhost:8000/admin/:

- **OpenAI**: Get from https://platform.openai.com/api-keys
- **Anthropic**: Get from https://console.anthropic.com/account/keys  
- **Google Gemini**: Get from https://makersuite.google.com/app/apikey
- **DeepSeek**: Get from https://platform.deepseek.com/api_keys
- **HuggingFace**: Get from https://huggingface.co/settings/tokens
- **Ollama**: Local installation (no API key needed)

### Redis Setup

#### Windows
```bash
# Use WSL or Docker:
docker run -d -p 6379:6379 redis:alpine
```

#### macOS
```bash
brew install redis
brew services start redis
```

#### Linux
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## 🚀 Running the Application

### Development Mode

1. **Start PostgreSQL** (ensure it's running):
```bash
# Check status
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS
```

2. **Start Redis** (in a separate terminal):
```bash
redis-server
# Or check if already running:
redis-cli ping  # Should return "PONG"
```

3. **Start Backend** (in backend directory):
```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start Django server
python manage.py runserver
```

4. **Start Celery Worker** (in another terminal, backend directory):
```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start Celery worker
celery -A InnoFlow worker --loglevel=info
```

5. **Start Frontend** (in frontend directory):
```bash
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/swagger/

## 🔄 Development Workflow

### Backend Development
```bash
# Create new migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run tests
python manage.py test

# Check API keys configuration
python check_api_keys.py

# Create new Django app
python manage.py startapp app_name
```

### Frontend Development
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Verify database exists
psql -U innoflow_user -d innoflow_db -c "\l"

# Check connection
python manage.py dbshell
```

#### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping
# Should return "PONG"

# Check Redis logs
sudo journalctl -u redis  # Linux
brew services info redis  # macOS
```

#### NextAuth Configuration Issues
- Verify NEXTAUTH_SECRET is at least 32 characters
- Check OAuth callback URLs match exactly
- Ensure NEXTAUTH_URL matches your development URL

#### API Integration Issues
- Check AI provider API keys in Django admin
- Verify CORS settings in Django
- Check NEXT_PUBLIC_API_URL points to correct backend

#### Module Import Errors
```bash
# Backend
pip install -r requirements.txt --force-reinstall
python manage.py check

# Frontend
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading
- Ensure `.env` files are in correct directories
- Check file names: `.env` for backend, `.env.local` for frontend
- Restart development servers after changing environment variables
- Verify no spaces around = in environment files

### Performance Issues

#### Slow Database Queries
```bash
# Check database performance
python manage.py shell
# Then run: from django.db import connection; print(connection.queries)
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear TypeScript cache
rm -rf .tsbuildinfo

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

1. **Check Logs**: Look at Django and Next.js console outputs
2. **Database Issues**: Check PostgreSQL logs
3. **API Issues**: Use browser dev tools or Postman
4. **Authentication Issues**: Verify OAuth configuration in both platforms

### Useful Commands

```bash
# Backend
python manage.py shell  # Django shell
python manage.py dbshell  # Database shell
python manage.py collectstatic  # Collect static files
python manage.py check  # Check for issues
python manage.py showmigrations  # Show migration status

# Frontend
npm run build  # Production build
npm run start  # Production server
npm run type-check  # TypeScript checking
npm run lint:fix  # Fix linting issues

# Database
psql -U innoflow_user -d innoflow_db  # Connect to database
pg_dump -U innoflow_user innoflow_db > backup.sql  # Backup database
psql -U innoflow_user -d innoflow_db < backup.sql  # Restore database
```

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Team Guidelines

1. **Code Style**: Follow PEP 8 for Python, ESLint/Prettier for TypeScript
2. **Commits**: Use conventional commit messages (feat:, fix:, docs:, etc.)
3. **Testing**: Write tests for new features
4. **Documentation**: Update README when adding new features
5. **Environment**: Never commit `.env` files or API keys
6. **Dependencies**: Update requirements.txt/package.json when adding packages
7. **Type Safety**: Use TypeScript strictly, avoid `any` types

## 🔒 Security Notes

- Keep API keys secure and rotate them regularly
- Use strong passwords for database and NextAuth secret
- Never commit sensitive information to version control
- Use HTTPS in production
- Regularly update dependencies

---

**Happy Coding! 🚀**

For questions or issues, please create an issue in the repository or contact the development team. 
# Environment Variables Configuration

This document explains all the environment variables and API keys required to run the InnoFlow application (both frontend and backend).

## Table of Contents

1. [Frontend Environment Variables](#frontend-environment-variables)
2. [Backend Environment Variables](#backend-environment-variables)  
3. [AI Provider API Keys](#ai-provider-api-keys)
4. [Database Configuration](#database-configuration)
5. [Authentication Configuration](#authentication-configuration)
6. [Optional Configuration](#optional-configuration)
7. [Setup Instructions](#setup-instructions)

---

## Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory with the following variables:

### Required Variables

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-32-chars-minimum

# Backend API Connection
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# GitHub OAuth (for authentication)
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# Public Google OAuth (for client-side components)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-oauth-client-id
```

### Optional Variables

```bash
# Feature Flags
NEXT_PUBLIC_ENABLE_VECTOR_STORES=true
NEXT_PUBLIC_ENABLE_MULTI_AGENT=true

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Development
NODE_ENV=development
```

---

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

### Required Variables

```bash
# Django Configuration
SECRET_KEY=your-django-secret-key-50-chars-long-random-string
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration (PostgreSQL)
DB_NAME=innoflow_db
DB_USER=innoflow_user
DB_PASSWORD=your-database-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google OAuth (Django Allauth)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# GitHub OAuth (Django Allauth)
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# Social Auth (Alternative authentication)
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your-google-oauth-client-id
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your-google-oauth-client-secret
SOCIAL_AUTH_GITHUB_KEY=your-github-oauth-client-id
SOCIAL_AUTH_GITHUB_SECRET=your-github-oauth-client-secret
```

### Optional Variables

```bash
# Email Configuration (for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@innoflow.com

# Celery Configuration (for async tasks)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

---

## AI Provider API Keys

These API keys are stored in the database through the admin interface, but you may need them for testing:

### OpenAI
```bash
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Anthropic (Claude)
```bash
# Get from: https://console.anthropic.com/account/keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Google Gemini
```bash
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### DeepSeek
```bash
# Get from: https://platform.deepseek.com/api_keys
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### HuggingFace
```bash
# Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Ollama (Local Models)
```bash
# Local installation - no API key needed
# Download from: https://ollama.ai
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Database Configuration

### PostgreSQL Setup

1. Install PostgreSQL
2. Create database and user:

```sql
CREATE DATABASE innoflow_db;
CREATE USER innoflow_user WITH ENCRYPTED PASSWORD 'your-database-password';
GRANT ALL PRIVILEGES ON DATABASE innoflow_db TO innoflow_user;
```

3. Update backend `.env`:
```bash
DB_NAME=innoflow_db
DB_USER=innoflow_user
DB_PASSWORD=your-database-password
```

---

## Authentication Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (Frontend)
   - `http://localhost:8000/accounts/google/login/callback/` (Backend)

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URLs:
   - `http://localhost:3000/api/auth/callback/github` (Frontend)
   - `http://localhost:8000/accounts/github/login/callback/` (Backend)

---

## Optional Configuration

### Redis (for Celery)

```bash
# Install Redis
# Ubuntu/Debian: sudo apt install redis-server
# macOS: brew install redis

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
```

### Email Configuration (Production)

```bash
# SMTP Email Settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
```

---

## Setup Instructions

### 1. Frontend Setup

```bash
cd frontend/
cp .env.example .env.local  # If example exists
# Edit .env.local with your values
npm install
npm run dev
```

### 2. Backend Setup

```bash
cd backend/
cp .env.example .env  # If example exists
# Edit .env with your values
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Development Workflow

1. Start PostgreSQL and Redis services
2. Start backend: `python manage.py runserver`
3. Start frontend: `npm run dev`
4. Access application at `http://localhost:3000`
5. Access admin at `http://localhost:8000/admin`

---

## Environment Files Summary






---

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit `.env` files to version control**
2. **Use different secrets for production**
3. **Rotate API keys regularly**
4. **Use environment-specific configurations**
5. **Keep NextAuth secret at least 32 characters**
6. **Use strong database passwords**

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `FRONTEND_URL` in backend `.env`
2. **Authentication Issues**: Verify OAuth callback URLs
3. **Database Connection**: Check PostgreSQL service and credentials
4. **API Key Errors**: Verify AI provider API keys in admin panel

### Getting Help

- Check Django logs: `tail -f workflow_debug.log`
- Check browser console for frontend errors
- Verify environment variables are loaded correctly
- Test API endpoints individually

---

## Production Deployment

For production deployment, update these variables:

```bash
# Frontend (.env.production)
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Backend (.env.production)
DEBUG=False
ALLOWED_HOSTS=your-domain.com,api.your-domain.com
SECRET_KEY=new-production-secret-key
DB_PASSWORD=strong-production-password
FRONTEND_URL=https://your-domain.com
```

Remember to update OAuth callback URLs for your production domain.
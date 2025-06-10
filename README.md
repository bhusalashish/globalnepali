# Global Nepali

A full-stack web application for connecting Nepalese people in the USA, particularly in the Bay Area. Built with React + TypeScript for frontend and Python FastAPI + MongoDB for backend.

## Features

- Modern UI with Material-UI and Nepali-inspired design
- JWT-based authentication
- Role-based access control
- Event management
- Article publishing
- Volunteer opportunities
- Sponsorship management
- Admin dashboard

## Tech Stack

### Frontend
- React + TypeScript
- Material-UI
- Redux Toolkit
- React Router
- Emotion for styling
- Axios for API calls

### Backend
- FastAPI
- MongoDB with Motor
- JWT Authentication
- Ruff for linting/formatting
- Docker

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/globalnepali.git
cd globalnepali
```

2. Create environment files:

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api/v1
```

Create `backend/.env`:
```
MONGODB_URL=mongodb://mongodb:27017/
DATABASE_NAME=globalnepali
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost", "http://localhost:80", "http://localhost:3000"]
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

4. Seed the database with initial data:
```bash
cd backend
python scripts/seed_data.py
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

Default admin credentials:
- Email: admin@globalnepali.org
- Password: admin123

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Code Quality
- Frontend: ESLint and Prettier
- Backend: Ruff for linting and formatting

Run backend linting:
```bash
cd backend
ruff check .
ruff format .
```

## Deployment

The application is containerized and can be deployed using Docker Compose. For production deployment:

1. Update environment variables in `backend/.env`
2. Update `JWT_SECRET` to a secure value
3. Configure proper MongoDB credentials
4. Set up proper SSL/TLS certificates
5. Deploy using:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 
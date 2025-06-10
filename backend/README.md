# Global Nepali Backend

This is the backend API for the Global Nepali platform, built with FastAPI and MongoDB.

## Prerequisites

- Python 3.9 or higher
- MongoDB 6.0 or higher
- uv (for package management)

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/globalnepali.git
cd globalnepali/backend
```

2. Install uv:
```bash
# Using pipx (recommended)
pipx install uv

# Or using pip
pip install uv
```

3. Create and activate a virtual environment:
```bash
uv venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
```

4. Install dependencies:
```bash
# Install all dependencies (including development)
uv pip install -r requirements.in

# Generate requirements.txt with locked versions
uv pip compile requirements.in -o requirements.txt

# Install only production dependencies
uv pip install -r requirements.in --exclude-newer 'pytest|ruff|httpx|asgi-lifespan'
```

5. Create a `.env` file in the backend directory:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=globalnepali
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
```

6. Start MongoDB locally:
```bash
mongod --dbpath /path/to/data/directory
```

7. Run the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication

The API uses JWT Bearer token authentication. To authenticate:

1. Create a user using the `/api/v1/auth/register` endpoint
2. Get a token using the `/api/v1/auth/login` endpoint
3. Use the token in the Authorization header: `Bearer <your-token>`

## Development Tools

### Package Management with uv

```bash
# Add a new package
uv pip install package_name

# Update dependencies
uv pip compile requirements.in -o requirements.txt --upgrade

# Install from requirements.txt (exact versions)
uv pip sync requirements.txt

# View outdated packages
uv pip list --outdated
```

### Code Formatting and Linting

We use Ruff for code formatting and linting. To format and lint your code:

```bash
# Format code
ruff format .

# Lint code
ruff check .

# Fix auto-fixable issues
ruff check --fix .
```

### Running Tests

We use pytest for testing. To run tests:

```bash
# Run all tests
pytest

# Run tests with coverage report
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run tests in watch mode (install pytest-watch first)
uv pip install pytest-watch
ptw
```

### Pre-commit Checks

Before committing your changes:

1. Update dependencies:
```bash
uv pip compile requirements.in -o requirements.txt
```

2. Format and lint your code:
```bash
ruff format .
ruff check .
```

3. Run tests:
```bash
pytest
```

4. Check coverage:
```bash
pytest --cov=app --cov-report=term-missing
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   └── main.py
├── tests/
├── .env
├── .gitignore
├── pyproject.toml
├── requirements.in
├── requirements.txt
└── README.md
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URL | MongoDB connection URL | mongodb://localhost:27017 |
| DATABASE_NAME | Database name | globalnepali |
| SECRET_KEY | JWT secret key | Required |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | 30 |
| ENVIRONMENT | development/production | development |

## Deployment

For production deployment:

1. Set environment variables
2. Install production dependencies:
```bash
uv pip install -r requirements.in --exclude-newer 'pytest|ruff|httpx|asgi-lifespan'
```

3. Run with a production ASGI server:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
``` 
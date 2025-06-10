#!/bin/bash

# Create environment files
echo "Creating environment files..."

# Frontend environment
cat > frontend/.env << EOL
VITE_API_URL=http://localhost:8000/api/v1
EOL

# Backend environment
cat > backend/.env << EOL
MONGODB_URL=mongodb://mongodb:27017/
DATABASE_NAME=globalnepali
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost", "http://localhost:80", "http://localhost:3000"]
EOL

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 10

# Run seed script
echo "Seeding the database..."
cd backend
python scripts/seed_data.py

echo "Initialization complete!"
echo "You can now access:"
echo "- Frontend: http://localhost"
echo "- Backend API: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
echo ""
echo "Default admin credentials:"
echo "- Email: admin@globalnepali.org"
echo "- Password: admin123" 
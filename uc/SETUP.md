# 🚀 Setup and Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)
- **Angular CLI** (v17 or higher)
- **Git** (optional, for version control)

Check versions:
```bash
node --version    # Should be v18+
npm --version
mongo --version
```

---

## 📥 Installation Steps

### 1. Clone or Download the Project

```bash
cd D:/angular/proj
cd urban-company-clone
```

---

### 2. Backend Setup

#### Step 2.1: Navigate to backend folder
```bash
cd backend
```

#### Step 2.2: Install dependencies
```bash
npm install
```

This will install:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- express-validator
- TypeScript and type definitions

#### Step 2.3: Create environment file
```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/urban-company-clone

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:4200
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

#### Step 2.4: Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath="C:\data\db"
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or use brew (Mac)
brew services start mongodb-community
```

#### Step 2.5: Seed the database
```bash
npm run seed
```

This will create:
- 3 users (Admin, User, Service Provider)
- 6 service categories
- 12 services
- Sample bookings and reviews

**Login Credentials Created:**
```
Admin:
  Email: admin@quickfix.com
  Password: Admin@123

User:
  Email: user@test.com
  Password: User@123

Service Provider:
  Email: provider@test.com
  Password: Provider@123
```

#### Step 2.6: Build TypeScript
```bash
npm run build
```

#### Step 2.7: Start backend server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run at: **http://localhost:5000**

Test API: http://localhost:5000/api/health

---

### 3. Frontend Setup

Open a **new terminal window**.

#### Step 3.1: Navigate to frontend folder
```bash
cd frontend
```

#### Step 3.2: Install Angular CLI globally (if not installed)
```bash
npm install -g @angular/cli
```

#### Step 3.3: Install dependencies
```bash
npm install
```

This will install:
- Angular core packages
- Angular Material
- RxJS
- TypeScript

#### Step 3.4: Update environment file (if needed)

Check `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'  // Should match backend URL
};
```

#### Step 3.5: Start Angular development server
```bash
ng serve
```

Or with specific port:
```bash
ng serve --port 4200
```

Frontend will run at: **http://localhost:4200**

---

## ✅ Verification

### Backend Verification
1. Open: http://localhost:5000/api/health
2. You should see:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2025-12-31T..."
   }
   ```

### Frontend Verification
1. Open: http://localhost:4200
2. You should see the home page with:
   - Header navigation
   - Hero section
   - Category cards
   - Featured services

### Test Login
1. Click "Login" button
2. Use credentials:
   - Email: `user@test.com`
   - Password: `User@123`
3. Should redirect to home page
4. User menu should appear in header

---

## 🛠️ Development Workflow

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
ng serve
```

### Making Changes

**Backend Changes:**
- Edit files in `backend/src/`
- Server auto-restarts with `nodemon`
- TypeScript compiles automatically

**Frontend Changes:**
- Edit files in `frontend/src/`
- Browser auto-refreshes
- Changes reflect immediately

---

## 📦 Building for Production

### Backend Production Build
```bash
cd backend
npm run build
npm start
```

### Frontend Production Build
```bash
cd frontend
ng build --configuration production
```

Output will be in `frontend/dist/` folder.

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Kill process using port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Angular CLI Not Found
```
'ng' is not recognized as an internal or external command
```
**Solution:** Install Angular CLI globally
```bash
npm install -g @angular/cli
```

### TypeScript Compilation Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### CORS Errors in Browser
**Solution:** Ensure backend CORS is configured correctly
- Check `CLIENT_URL` in `.env`
- Verify it matches your frontend URL

---

## 📝 API Testing with Postman/Thunder Client

### Import Collection

**Base URL:** `http://localhost:5000/api`

**Sample Requests:**

1. **Register User**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123",
  "phone": "9876543210"
}
```

2. **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "User@123"
}
```

3. **Get Categories**
```http
GET /categories
```

4. **Get Services** (with filters)
```http
GET /services?featured=true&sort=rating
```

5. **Create Booking** (requires auth)
```http
POST /bookings
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "service": "<service-id>",
  "scheduledDate": "2025-01-15",
  "scheduledTime": "14:00",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cash"
}
```

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:5000/api |
| API Health | http://localhost:5000/api/health |

---

## 📚 Useful Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Compile TypeScript
npm start            # Start production server
npm run seed         # Seed database
```

### Frontend
```bash
ng serve             # Start development server
ng build             # Build for production
ng test              # Run tests
ng lint              # Lint code
```

### Database
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use database
use urban-company-clone

# Show collections
show collections

# Find all users
db.users.find()

# Drop database (careful!)
db.dropDatabase()
```

---

## 🎯 Next Steps

1. ✅ Setup complete
2. 📖 Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation
3. 🎨 Explore the UI at http://localhost:4200
4. 🔧 Test API endpoints
5. 💡 Start customizing for your needs

---

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check console for error messages
5. Review environment variables

---

**Happy Coding! 🚀**

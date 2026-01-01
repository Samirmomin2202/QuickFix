# Urban Company Clone - MEAN Stack

A full-stack web application clone of Urban Company built with MongoDB, Express.js, Angular, and Node.js.

## 🏗️ Architecture

```
urban-company-clone/
├── backend/                 # Node.js + Express.js API
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   ├── seeders/           # Database seed data
│   └── server.js          # Entry point
│
└── frontend/              # Angular application
    ├── src/
    │   ├── app/
    │   │   ├── core/      # Core module (guards, interceptors, services)
    │   │   ├── shared/    # Shared module (components, pipes, directives)
    │   │   ├── features/  # Feature modules (home, services, bookings)
    │   │   └── app.module.ts
    │   ├── assets/        # Images, styles
    │   └── environments/  # Environment configs
    └── angular.json

```

## 🚀 Features

### Backend
- ✅ RESTful API architecture
- ✅ JWT-based authentication
- ✅ Role-based authorization (Admin, User, Service Provider)
- ✅ MongoDB with Mongoose ODM
- ✅ Centralized error handling
- ✅ Input validation
- ✅ Secure password hashing

### Frontend
- ✅ Angular 17+ with standalone components
- ✅ Modular architecture
- ✅ HTTP Interceptors for JWT
- ✅ Route Guards (Auth, Role)
- ✅ Reactive Forms
- ✅ Responsive UI (Mobile-first)
- ✅ Angular Material & Tailwind CSS

### Database
- ✅ Users collection (with roles)
- ✅ Categories collection
- ✅ Services collection
- ✅ Bookings collection
- ✅ Reviews collection
- ✅ Optimized indexing

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- Angular CLI (v17+)
- npm or yarn

## 🛠️ Installation

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urban-company-clone
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed the database:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Update environment file `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

Start Angular development server:
```bash
ng serve
```

Frontend runs at: `http://localhost:4200`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/update` | Update user profile | Private |

### Categories Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get category by ID | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Services Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/services` | Get all services | Public |
| GET | `/api/services/:id` | Get service by ID | Public |
| GET | `/api/services/category/:categoryId` | Get services by category | Public |
| POST | `/api/services` | Create service | Admin |
| PUT | `/api/services/:id` | Update service | Admin |
| DELETE | `/api/services/:id` | Delete service | Admin |

### Bookings Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/bookings` | Get user bookings | User |
| GET | `/api/bookings/:id` | Get booking by ID | User |
| POST | `/api/bookings` | Create booking | User |
| PUT | `/api/bookings/:id` | Update booking | User/Provider |
| DELETE | `/api/bookings/:id` | Cancel booking | User |

### Reviews Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/reviews/service/:serviceId` | Get service reviews | Public |
| POST | `/api/reviews` | Create review | User |
| PUT | `/api/reviews/:id` | Update review | User |
| DELETE | `/api/reviews/:id` | Delete review | User/Admin |

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['user', 'admin', 'service-provider'],
  address: Object,
  createdAt: Date
}
```

### Category Schema
```javascript
{
  name: String,
  description: String,
  icon: String,
  isActive: Boolean
}
```

### Service Schema
```javascript
{
  name: String,
  description: String,
  category: ObjectId (ref: Category),
  price: Number,
  duration: Number,
  image: String,
  rating: Number,
  isActive: Boolean
}
```

### Booking Schema
```javascript
{
  user: ObjectId (ref: User),
  service: ObjectId (ref: Service),
  serviceProvider: ObjectId (ref: User),
  scheduledDate: Date,
  scheduledTime: String,
  address: Object,
  status: Enum ['pending', 'confirmed', 'completed', 'cancelled'],
  totalAmount: Number,
  paymentStatus: Enum ['pending', 'paid', 'refunded']
}
```

### Review Schema
```javascript
{
  user: ObjectId (ref: User),
  service: ObjectId (ref: Service),
  booking: ObjectId (ref: Booking),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

## 👥 Default Users (After Seeding)

**Admin:**
- Email: `admin@quickfix.com`
- Password: `Admin@123`

**User:**
- Email: `user@test.com`
- Password: `User@123`

**Service Provider:**
- Email: `provider@test.com`
- Password: `Provider@123`

## 🎨 UI Pages

1. **Home Page** - Hero banner, featured services, categories
2. **Services Page** - Service listing with filters
3. **Service Detail** - Service info, reviews, booking button
4. **Login/Signup** - Authentication forms
5. **My Bookings** - User booking history
6. **Admin Dashboard** - Manage services, categories, bookings

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies (optional)
- Input sanitization
- Rate limiting (recommended for production)
- CORS configuration
- Environment variable protection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
ng test
```

## 📦 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
ng build --configuration production
```

## 🤝 Contributing

This is an educational project. Feel free to fork and enhance!

## 📄 License

MIT License - Educational purposes only

## 👨‍💻 Author

Built as a MEAN stack demonstration project

---

**Note:** This is a clone for educational purposes only. Urban Company is a trademark of its respective owners.

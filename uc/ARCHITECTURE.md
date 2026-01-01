# 🏗️ Urban Company Clone - Complete Architecture Documentation

## Project Overview

A full-stack Urban Company website clone built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) using **TypeScript** for both backend and frontend. This project demonstrates enterprise-level architecture, best practices, and production-ready code.

---

## 📁 Project Structure

```
urban-company-clone/
│
├── backend/                          # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                # MongoDB connection
│   │   │
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── serviceController.ts
│   │   │   ├── bookingController.ts
│   │   │   └── reviewController.ts
│   │   │
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── auth.ts             # JWT verification & role check
│   │   │   ├── errorHandler.ts     # Centralized error handling
│   │   │   └── validate.ts         # Request validation
│   │   │
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Category.ts
│   │   │   ├── Service.ts
│   │   │   ├── Booking.ts
│   │   │   └── Review.ts
│   │   │
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── categoryRoutes.ts
│   │   │   ├── serviceRoutes.ts
│   │   │   ├── bookingRoutes.ts
│   │   │   └── reviewRoutes.ts
│   │   │
│   │   ├── types/                   # TypeScript interfaces
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                   # Helper functions
│   │   │   └── errorResponse.ts
│   │   │
│   │   ├── seeders/                 # Database seeders
│   │   │   └── seed.ts
│   │   │
│   │   └── server.ts                # Entry point
│   │
│   ├── .env.example                 # Environment template
│   ├── tsconfig.json                # TypeScript config
│   └── package.json
│
└── frontend/                         # Angular + TypeScript
    ├── src/
    │   ├── app/
    │   │   ├── core/                # Core module (singleton services)
    │   │   │   ├── guards/
    │   │   │   │   ├── auth.guard.ts
    │   │   │   │   └── role.guard.ts
    │   │   │   │
    │   │   │   ├── interceptors/
    │   │   │   │   ├── auth.interceptor.ts
    │   │   │   │   └── error.interceptor.ts
    │   │   │   │
    │   │   │   ├── models/
    │   │   │   │   └── index.ts
    │   │   │   │
    │   │   │   ├── services/
    │   │   │   │   ├── auth.service.ts
    │   │   │   │   ├── category.service.ts
    │   │   │   │   ├── service.service.ts
    │   │   │   │   ├── booking.service.ts
    │   │   │   │   ├── review.service.ts
    │   │   │   │   └── loading.service.ts
    │   │   │   │
    │   │   │   └── core.module.ts
    │   │   │
    │   │   ├── shared/              # Shared module (reusable components)
    │   │   │   ├── components/
    │   │   │   │   ├── header/
    │   │   │   │   ├── footer/
    │   │   │   │   └── loading/
    │   │   │   │
    │   │   │   └── shared.module.ts
    │   │   │
    │   │   ├── features/            # Feature modules (lazy loaded)
    │   │   │   ├── home/
    │   │   │   │   ├── home.component.ts
    │   │   │   │   ├── home.component.html
    │   │   │   │   ├── home.component.scss
    │   │   │   │   ├── home-routing.module.ts
    │   │   │   │   └── home.module.ts
    │   │   │   │
    │   │   │   ├── auth/
    │   │   │   │   ├── login/
    │   │   │   │   ├── register/
    │   │   │   │   ├── auth-routing.module.ts
    │   │   │   │   └── auth.module.ts
    │   │   │   │
    │   │   │   ├── services/        # (Service listing & details)
    │   │   │   ├── bookings/        # (User bookings)
    │   │   │   └── profile/         # (User profile)
    │   │   │
    │   │   ├── app-routing.module.ts
    │   │   ├── app.component.ts
    │   │   └── app.module.ts
    │   │
    │   ├── environments/
    │   │   ├── environment.ts
    │   │   └── environment.prod.ts
    │   │
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.scss
    │
    ├── angular.json
    ├── tsconfig.json
    └── package.json
```

---

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Language:** TypeScript 5.x
- **Database:** MongoDB 6+ with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Express-validator
- **Security:** bcryptjs (password hashing)

### Frontend
- **Framework:** Angular 17+
- **Language:** TypeScript 5.x
- **UI Library:** Angular Material 17+
- **Styling:** SCSS
- **HTTP Client:** Angular HttpClient
- **Routing:** Angular Router (with lazy loading)
- **Forms:** Reactive Forms

---

## 🎯 Key Features Implemented

### Backend Features
✅ **RESTful API Architecture**
✅ **JWT-based Authentication**
✅ **Role-based Authorization** (Admin, User, Service Provider)
✅ **MongoDB Schema Design** with Mongoose
✅ **Input Validation** using Express-validator
✅ **Centralized Error Handling**
✅ **Database Indexing** for performance
✅ **Password Hashing** with bcrypt
✅ **CORS Configuration**
✅ **Environment Variables** (.env)
✅ **Database Seeding** with sample data

### Frontend Features
✅ **Modular Architecture** (Core, Shared, Features)
✅ **Lazy Loading** for routes
✅ **HTTP Interceptors** for JWT handling
✅ **Route Guards** (Auth & Role)
✅ **Reactive Forms** with validation
✅ **Angular Material** components
✅ **Responsive Design** (mobile-first)
✅ **Loading States** & Error Handling
✅ **Service Communication** via RxJS Observables

---

## 🗄️ Database Schema Design

### Collections

#### 1. **Users**
```typescript
{
  name: string
  email: string (unique, indexed)
  password: string (hashed)
  phone: string
  role: 'user' | 'admin' | 'service-provider'
  address: {
    street, city, state, pincode, country
  }
  profileImage: string
  isActive: boolean
  timestamps
}
```

#### 2. **Categories**
```typescript
{
  name: string (unique)
  description: string
  icon: string
  image: string
  slug: string (auto-generated, indexed)
  isActive: boolean
  displayOrder: number
  timestamps
}
```

#### 3. **Services**
```typescript
{
  name: string
  description: string
  category: ObjectId (ref: Category, indexed)
  price: number
  discountPrice: number
  duration: number (minutes)
  image: string
  images: string[]
  rating: number (0-5)
  reviewCount: number
  isActive: boolean
  isFeatured: boolean (indexed)
  features: string[]
  tags: string[]
  timestamps
}
```

#### 4. **Bookings**
```typescript
{
  user: ObjectId (ref: User, indexed)
  service: ObjectId (ref: Service)
  serviceProvider: ObjectId (ref: User, indexed)
  scheduledDate: Date
  scheduledTime: string
  address: { street, city, state, pincode, landmark }
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet'
  notes: string
  cancellationReason: string
  cancelledAt: Date
  completedAt: Date
  timestamps
}
```

#### 5. **Reviews**
```typescript
{
  user: ObjectId (ref: User)
  service: ObjectId (ref: Service, indexed)
  booking: ObjectId (ref: Booking, unique)
  rating: number (1-5)
  comment: string
  images: string[]
  isVerified: boolean
  helpful: number
  timestamps
}
```

### Database Relationships
- **One-to-Many:** Category → Services
- **Many-to-One:** Service → Category
- **One-to-Many:** User → Bookings
- **One-to-Many:** Service → Reviews
- **One-to-One:** Booking → Review

---

## 🔐 Authentication & Authorization Flow

### Registration
1. User submits registration form
2. Backend validates input
3. Password is hashed using bcrypt
4. User document created in MongoDB
5. JWT token generated and returned
6. Frontend stores token in localStorage

### Login
1. User submits credentials
2. Backend finds user by email
3. Password verified using bcrypt.compare()
4. JWT token generated with user ID & role
5. Token returned to frontend
6. Frontend stores token and user data

### Protected Routes
1. Frontend HTTP Interceptor adds token to headers
2. Backend middleware verifies JWT
3. User object attached to request
4. Role-based access control applied

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/update` | Update profile | Private |
| PUT | `/api/auth/updatepassword` | Change password | Private |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get single category | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Services
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/services` | Get all services (with filters) | Public |
| GET | `/api/services/:id` | Get single service | Public |
| GET | `/api/services/category/:categoryId` | Get services by category | Public |
| POST | `/api/services` | Create service | Admin |
| PUT | `/api/services/:id` | Update service | Admin |
| DELETE | `/api/services/:id` | Delete service | Admin |

### Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/bookings` | Get user's bookings | Private |
| GET | `/api/bookings/:id` | Get single booking | Private |
| POST | `/api/bookings` | Create booking | Private |
| PUT | `/api/bookings/:id` | Update booking | Private |
| DELETE | `/api/bookings/:id` | Cancel booking | Private |

### Reviews
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/reviews/service/:serviceId` | Get service reviews | Public |
| POST | `/api/reviews` | Create review | Private |
| PUT | `/api/reviews/:id` | Update review | Private |
| DELETE | `/api/reviews/:id` | Delete review | Private |

---

## 🎨 UI/UX Design Principles

### Color Scheme (Urban Company Inspired)
- **Primary:** #6e45e2 (Purple gradient)
- **Secondary:** #88d3ce (Turquoise)
- **Accent:** #ff6584 (Pink)
- **Text:** #2c3e50 (Dark)
- **Background:** #f5f7fa (Light gray)

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Key UI Components
- **Header:** Fixed navigation with user menu
- **Hero Section:** Gradient background with search
- **Category Cards:** Icon-based grid layout
- **Service Cards:** Image, rating, price display
- **Forms:** Material Design with validation
- **Footer:** Multi-column layout

---

## 🔒 Security Best Practices

1. **Password Security**
   - Hashed using bcrypt (10 salt rounds)
   - Never returned in API responses

2. **JWT Security**
   - Signed with secret key
   - Expires after 7 days
   - Verified on every protected route

3. **Input Validation**
   - Server-side validation with express-validator
   - Client-side validation with Angular Reactive Forms
   - MongoDB schema validation

4. **CORS Protection**
   - Configured to allow only frontend origin
   - Credentials enabled for cookies

5. **Error Handling**
   - Sensitive data not exposed in errors
   - Stack traces only in development mode

---

## 📚 Learning Outcomes

This project demonstrates proficiency in:

✅ **Full-stack TypeScript development**
✅ **RESTful API design and implementation**
✅ **MongoDB database modeling and optimization**
✅ **JWT authentication and authorization**
✅ **Angular modular architecture**
✅ **Reactive programming with RxJS**
✅ **Material Design implementation**
✅ **Responsive web design**
✅ **Git version control**
✅ **Environment-based configuration**

---

## 🚀 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Real-time notifications (Socket.io)
- [ ] Image upload functionality (Cloudinary)
- [ ] Admin dashboard with analytics
- [ ] Service provider mobile app
- [ ] Advanced search with filters
- [ ] Booking calendar view
- [ ] Chat system for customer support
- [ ] Email notifications (Nodemailer)
- [ ] Redis caching for performance
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

---

## 📝 Code Quality Standards

- **TypeScript strict mode** enabled
- **ESLint** for code linting
- **Consistent naming conventions** (camelCase, PascalCase)
- **Modular architecture** for scalability
- **Separation of concerns** (MVC pattern)
- **DRY principle** (Don't Repeat Yourself)
- **SOLID principles** applied

---

## 🎓 Academic/Professional Use

This project is ideal for:
- **Final year projects** (B.Tech/MCA)
- **Portfolio demonstrations** for job interviews
- **Internship applications**
- **Freelance project template**
- **Learning MEAN stack development**

**Educational Disclaimer:** This is a clone created for learning purposes only. Urban Company is a registered trademark of their respective owners.

---

**Built with ❤️ using the MEAN Stack (TypeScript Edition)**

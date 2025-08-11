# QuickCourt - Sports Facility Booking System

A full-stack sports facility booking application with role-based access control (User, FacilityOwner, Admin) built with React, Node.js, MongoDB, and Clerk authentication.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: Clerk
- **File Upload**: Cloudinary
- **Database**: MongoDB

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB running locally or MongoDB Atlas connection string
- Clerk account for authentication
- Cloudinary account for image uploads

### 1. Environment Setup

Create `.env` files in both `server/` and `auth/` directories:

**server/.env:**

```env
MONGODB_URI=mongodb://localhost:27017/quickcourt
CLERK_SECRET_KEY=your_clerk_secret_key
ADMIN_SECRET=your_admin_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**auth/.env:**

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../auth
npm install
```

### 3. Start the Backend

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

### 4. Start the Frontend

```bash
cd auth
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🧪 Testing the System

### 1. Test Backend API

```bash
cd server
node test-api.js
```

### 2. User Flow Testing

1. **Sign Up as Facility Owner**

   - Go to `/sign-up`
   - Select "Facility Owner" role
   - Complete Clerk signup

2. **Create a Facility**

   - Navigate to `/owner/dashboard/facility`
   - Fill out the facility form
   - Upload an image
   - Submit (facility will be pending approval)

3. **Sign Up as Admin**

   - Go to `/admin-unlock`
   - Enter your admin secret
   - You'll be promoted to Admin role

4. **Approve Facility**

   - Navigate to `/admin/dashboard`
   - See pending facilities
   - Click "Approve" or "Reject"

5. **Manage Courts**

   - As Facility Owner, go to `/owner/dashboard/courts`
   - Add courts to your approved facility
   - Set pricing and operating hours

6. **Book as User**
   - Sign up as a regular User
   - Browse venues at `/venues`
   - Make bookings

## 🔐 Role System

### User

- Browse approved facilities
- Make and cancel bookings
- View personal booking history

### FacilityOwner

- Create and manage facilities
- Add courts with pricing
- View analytics and earnings
- Manage court availability

### Admin

- Approve/reject facility submissions
- View system statistics
- Manage user roles
- Monitor platform activity

## 📁 Project Structure

```
Booking/
├── auth/                    # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── server/                  # Backend Node.js app
│   ├── controllers/         # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom middleware
│   └── utils/              # Utility functions
└── README.md
```

## 🔧 API Endpoints

### Public

- `GET /api/facilities` - List approved facilities
- `GET /api/facilities/:id` - Get facility details

### Authenticated

- `POST /api/facilities` - Create facility (FacilityOwner)
- `GET /api/facilities/mine` - Get user's facilities (FacilityOwner)
- `POST /api/courts` - Create court (FacilityOwner)
- `GET /api/courts/facility/:id` - Get facility courts (FacilityOwner)
- `POST /api/bookings` - Create booking (User)
- `GET /api/bookings/me` - Get user's bookings
- `DELETE /api/bookings/:id` - Cancel booking (User)

### Admin Only

- `GET /api/admin/stats` - System statistics
- `GET /api/facilities/pending` - Pending facilities
- `PUT /api/facilities/:id/approve` - Approve/reject facility
- `PUT /api/admin/users/:id/role` - Update user role

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Clerk Authentication Errors**

   - Verify Clerk keys in `.env`
   - Check Clerk dashboard configuration

3. **Image Upload Fails**

   - Verify Cloudinary credentials
   - Check file size and format

4. **CORS Errors**
   - Backend CORS is configured for localhost:5173
   - Update if using different frontend port

### Debug Mode

Enable detailed logging in the backend by setting:

```env
NODE_ENV=development
```

## 📝 Development Notes

- The system uses Clerk JWT tokens for authentication
- Facilities require admin approval before becoming public
- Court management is tied to specific facilities
- Booking system prevents double-booking of time slots
- Role-based access control is enforced at both frontend and backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

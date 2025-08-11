# QuickCourt - Local Sports Booking Platform

A modern, full-stack sports venue booking application that connects sports enthusiasts with local venues. Built with React, TypeScript, Node.js, Express, and MongoDB.

![QuickCourt Banner](https://images.unsplash.com/photo-1543166145-43227661d0e8?q=80&w=1600&auto=format&fit=crop)

## 🚀 Features

### For Sports Enthusiasts
- 🏟️ **Smart Venue Discovery**: Browse and search sports venues with advanced filters
- 🎯 **Multi-Sport Support**: Badminton, Tennis, Football, Basketball, Swimming, Cricket
- 📅 **Real-time Booking**: Book courts with instant availability checking
- 💳 **Secure Payments**: Integrated payment processing
- 📱 **Mobile-First Design**: Responsive interface for all devices
- ⭐ **Rating & Reviews**: Make informed decisions with user feedback
- 🔔 **Booking Management**: Track and manage your bookings

### For Venue Owners
- 📊 **Dashboard Analytics**: Track bookings, earnings, and trends
- 🏢 **Venue Management**: Add and manage multiple venues
- 📈 **Revenue Insights**: Monitor earnings and popular time slots
- 👥 **Customer Management**: View booking history and customer details

### Technical Features
- 🔐 **Secure Authentication**: Powered by Clerk
- ⚡ **Real-time Updates**: Live booking status and availability
- 🎨 **Modern UI/UX**: Beautiful interface with Tailwind CSS
- 📊 **Data Visualization**: Charts and analytics for insights
- 🔍 **Advanced Search**: Filter by sport, price, rating, location
- 📱 **Progressive Web App**: Works offline and installable

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript for type safety
- **Vite** for lightning-fast development and building
- **Tailwind CSS 4** for modern, responsive styling
- **Clerk** for secure authentication and user management
- **Axios** for reliable HTTP requests
- **React Router 7** for client-side routing
- **Chart.js** for data visualization

### Backend
- **Node.js** with Express 5 for robust API
- **MongoDB** with Mongoose for flexible data modeling
- **CORS** for secure cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging
- **Zod** for runtime type validation
- **Cloudinary** for image upload and management
- **Multer** for file handling

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Nodemon** for auto-restart during development
- **PostCSS** for CSS processing

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <repository-url>
cd QuickCourt-A-Local-Sports-Booking-main
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# See Environment Configuration section below

# Start MongoDB (if running locally)
# Make sure MongoDB is running on localhost:27017

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to auth directory (frontend)
cd auth

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running on `http://localhost:5173`

### 4. Verify Installation

- Backend: Visit `http://localhost:5000/health`
- Frontend: Visit `http://localhost:5173`
- API Documentation: Visit `http://localhost:5000`

## ⚙️ Environment Configuration

### Backend (.env)

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/quickcourt

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Clerk Configuration (for authentication)
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret (if using custom auth)
JWT_SECRET=your_jwt_secret_here
```

### Frontend Configuration

The frontend uses environment variables for API configuration. Create a `.env` file in the `auth` directory if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Venue Endpoints
- `GET /venues` - Get all venues with filtering
- `GET /venues/:id` - Get specific venue details
- `GET /venues/sports` - Get all available sports
- `POST /venues` - Create new venue (owner only)
- `PUT /venues/:id` - Update venue (owner only)
- `DELETE /venues/:id` - Delete venue (owner only)

### Booking Endpoints
- `GET /bookings` - Get user's bookings
- `GET /bookings/venue/:venueId` - Get venue bookings for date
- `POST /bookings` - Create new booking
- `GET /bookings/:id` - Get specific booking
- `PUT /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

### Payment Endpoints
- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `GET /payments/history` - Get payment history

### Facility Owner Endpoints
- `GET /facility-owner/dashboard` - Owner dashboard data
- `GET /facility-owner/venues` - Owner's venues
- `GET /facility-owner/earnings` - Earnings analytics

## 🗄️ Database Schema

### Venue Model
```javascript
{
  name: String,                    // Venue name
  sport: String,                   // Primary sport
  location: String,                // Venue location
  rating: Number,                  // Average rating (1-5)
  reviews: Number,                 // Number of reviews
  indoor: Boolean,                 // Indoor/outdoor venue
  pricePerHour: Number,            // Base price per hour
  image: String,                   // Venue image URL
  budget: Boolean,                 // Budget-friendly flag
  sports: [{                       // Supported sports
    code: String,                  // Sport code (badminton, tennis, etc.)
    name: String,                  // Sport name
    courts: [String],              // Available courts
    indoor: Boolean,               // Indoor/outdoor for this sport
    surface: String,               // Court surface type
    pricePerHour: Number           // Price for this sport
  }],
  description: String,             // Venue description
  amenities: [String],             // Available amenities
  openingHours: {                  // Operating hours
    open: String,                  // Opening time (HH:MM)
    close: String                  // Closing time (HH:MM)
  },
  contact: {                       // Contact information
    phone: String,                 // Phone number
    email: String                  // Email address
  }
}
```

### Booking Model
```javascript
{
  userId: String,                  // User ID
  venueId: ObjectId,               // Reference to venue
  sportCode: String,               // Sport being played
  court: String,                   // Court/field name
  startTime: Date,                 // Booking start time
  endTime: Date,                   // Booking end time
  duration: Number,                // Duration in hours
  totalPrice: Number,              // Total booking cost
  status: String,                  // Booking status
  paymentStatus: String,           // Payment status
  userDetails: {                   // User information
    name: String,                  // User name
    email: String,                 // User email
    phone: String                  // User phone
  }
}
```

### User Profile Model
```javascript
{
  userId: String,                  // Clerk user ID
  name: String,                    // Full name
  email: String,                   // Email address
  phone: String,                   // Phone number
  preferences: {                   // User preferences
    favoriteSports: [String],      // Preferred sports
    budget: Number,                // Budget preference
    location: String               // Preferred location
  },
  bookingHistory: [ObjectId]       // Past bookings
}
```

## 📁 Project Structure

```
QuickCourt-A-Local-Sports-Booking-main/
├── auth/                          # Frontend Application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── api/                   # API service functions
│   │   │   ├── axiosConfig.ts     # Axios configuration
│   │   │   ├── bookingApi.ts      # Booking API calls
│   │   │   ├── venueApi.ts        # Venue API calls
│   │   │   └── paymentApi.ts      # Payment API calls
│   │   ├── components/            # Reusable components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   ├── Navbar.tsx         # Navigation component
│   │   │   ├── VenueCard.tsx      # Venue display card
│   │   │   └── VenueFilters.tsx   # Search and filter component
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.tsx           # Home page
│   │   │   ├── VenuesPage.tsx     # Venues listing
│   │   │   ├── BookCourtPage.tsx  # Booking page
│   │   │   ├── DashBoard.tsx      # User dashboard
│   │   │   └── PaymentPage.tsx    # Payment processing
│   │   ├── routes/                # Routing configuration
│   │   ├── types/                 # TypeScript definitions
│   │   └── lib/                   # Utility libraries
│   ├── package.json               # Frontend dependencies
│   └── vite.config.ts            # Vite configuration
├── server/                        # Backend Application
│   ├── models/                    # MongoDB models
│   │   ├── Venue.js              # Venue data model
│   │   ├── Booking.js            # Booking data model
│   │   ├── UserProfile.js        # User profile model
│   │   └── Payment.js            # Payment model
│   ├── routes/                    # API routes
│   │   ├── venueRoutes.js        # Venue endpoints
│   │   ├── bookingRoutes.js      # Booking endpoints
│   │   ├── paymentRoutes.js      # Payment endpoints
│   │   └── facilityOwnerRoutes.js # Owner endpoints
│   ├── middleware/                # Express middleware
│   │   ├── auth.js               # Authentication middleware
│   │   └── error.js              # Error handling
│   ├── controllers/               # Route controllers
│   ├── utils/                     # Utility functions
│   │   ├── clerk.js              # Clerk integration
│   │   └── cloudinary.js         # Image upload
│   ├── seedData.js               # Database seeding
│   ├── server.js                 # Main server file
│   └── package.json              # Backend dependencies
└── README.md                     # Project documentation
```

## 🎯 Features in Detail

### Venue Discovery & Search
- **Smart Search**: Search by venue name, location, or sport
- **Advanced Filters**: 
  - Sport type (Badminton, Tennis, Football, etc.)
  - Price range (Budget-friendly options)
  - Indoor/Outdoor preference
  - Rating filter (4+ stars, etc.)
  - Distance-based sorting
- **Sorting Options**: By relevance, price (low to high), rating, distance
- **Pagination**: Handle large result sets efficiently

### Booking System
- **Real-time Availability**: Check court availability instantly
- **Conflict Prevention**: Prevent double bookings automatically
- **Flexible Duration**: Book for 1-4 hours
- **Time Slot Selection**: Choose from available time slots
- **Instant Confirmation**: Get booking confirmation immediately

### User Experience
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Intuitive Navigation**: Easy-to-use interface
- **Modern UI**: Clean, professional design

### Dashboard Analytics
- **Booking Trends**: Visual charts showing booking patterns
- **Earnings Overview**: Revenue tracking for venue owners
- **Popular Time Slots**: Peak hours analysis
- **Customer Insights**: User behavior analytics

## 🚀 Development

### Running in Development Mode

1. **Backend Development**:
   ```bash
   cd server
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Frontend Development**:
   ```bash
   cd auth
   npm run dev  # Uses Vite for fast HMR
   ```

### Database Operations

**Seed the Database**:
```bash
cd server
npm run seed
```

This populates the database with sample venues including:
- SBR Badminton (Vaishnodevi Cir)
- Skyline Racquet (Navrangpura)
- Prime Sports Arena (Science City)
- Court House (Drive-In Rd)
- Aqua Dome (Sabarmati)
- Pitch Perfect (Thaltej)

**Clear Database**:
```bash
cd server
node -e "require('./models/Venue').deleteMany({}).then(() => console.log('Database cleared'))"
```

### API Testing

Test the API endpoints using:

**Postman Collection**:
```json
{
  "info": {
    "name": "QuickCourt API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Venues",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/venues"
      }
    },
    {
      "name": "Get Venues by Sport",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/venues?sport=Badminton&maxPrice=500"
      }
    },
    {
      "name": "Create Booking",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/bookings",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": \"user123\",\n  \"venueId\": \"venueId\",\n  \"sportCode\": \"badminton\",\n  \"court\": \"Court 1\",\n  \"startTime\": \"2024-01-15T10:00:00\",\n  \"endTime\": \"2024-01-15T12:00:00\",\n  \"duration\": 2,\n  \"totalPrice\": 700\n}"
        }
      }
    }
  ]
}
```

**cURL Examples**:
```bash
# Get all venues
curl http://localhost:5000/api/venues

# Get venues filtered by sport and price
curl "http://localhost:5000/api/venues?sport=Badminton&maxPrice=500"

# Get specific venue
curl http://localhost:5000/api/venues/venueId

# Create a booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "venueId": "venueId",
    "sportCode": "badminton",
    "court": "Court 1",
    "startTime": "2024-01-15T10:00:00",
    "endTime": "2024-01-15T12:00:00",
    "duration": 2,
    "totalPrice": 700
  }'
```

## 🚀 Deployment

### Backend Deployment

**Option 1: Railway**
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

**Option 2: Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-quickcourt-app

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

**Option 3: DigitalOcean App Platform**
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with one click

### Frontend Deployment

**Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd auth
vercel

# Follow the prompts
```

**Option 2: Netlify**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

**Option 3: GitHub Pages**
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/quickcourt",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### Environment Variables for Production

**Backend (.env)**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickcourt
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
CLERK_SECRET_KEY=your_production_clerk_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Frontend (.env)**:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and add tests if applicable
4. **Commit your changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Include error handling
- Write meaningful commit messages
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README first
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact us at support@quickcourt.com

### Common Issues

**MongoDB Connection Error**:
- Ensure MongoDB is running
- Check your connection string
- Verify network connectivity

**CORS Errors**:
- Check FRONTEND_URL in backend .env
- Ensure frontend URL is in CORS whitelist

**Authentication Issues**:
- Verify Clerk configuration
- Check environment variables
- Ensure proper redirect URLs

## 🙏 Acknowledgments

- **Clerk** for authentication services
- **Tailwind CSS** for beautiful styling
- **MongoDB** for flexible data storage
- **Vite** for fast development experience
- **Unsplash** for sample images

## 📊 Project Status

- ✅ **Core Features**: Complete
- ✅ **Authentication**: Implemented
- ✅ **Booking System**: Working
- ✅ **Payment Integration**: Ready
- 🔄 **Mobile App**: In Development
- 🔄 **Advanced Analytics**: Planned
- 🔄 **Multi-language Support**: Planned

---

**QuickCourt** - Making sports booking simple, accessible, and enjoyable! 🏸⚽🏀🏊‍♂️🎾🏓

*Built with ❤️ for the sports community*

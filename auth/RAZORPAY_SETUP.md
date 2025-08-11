# Razorpay Integration Setup Guide

## 1. Environment Variables Setup

Create a `.env` file in the `auth` directory with the following variables:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Razorpay Payment Gateway
VITE_RAZORPAY_KEY_ID=rzp_test_your_test_key_here
VITE_RAZORPAY_KEY_SECRET=your_test_secret_key_here

# For Production (when ready)
# VITE_RAZORPAY_LIVE_KEY_ID=rzp_live_your_live_key_here
# VITE_RAZORPAY_LIVE_KEY_SECRET=your_live_secret_key_here

# Backend API URL
VITE_API_URL=http://localhost:5000
```

## 2. Get Your Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login to your account
3. Go to Settings → API Keys
4. Generate a new key pair
5. Copy the Key ID and Key Secret

## 3. Test Mode vs Production Mode

### Test Mode (Development)

- Use `rzp_test_` keys
- Test with card: `4111 1111 1111 1111`
- No real money involved

### Production Mode (Live)

- Use `rzp_live_` keys
- Real payments processed
- Switch environment variables accordingly

## 4. Backend Integration

The backend already has the `/api/bookings/create-order` endpoint that creates Razorpay orders.

## 5. Testing the Integration

1. Start your backend server
2. Start your frontend
3. Go through the booking flow
4. Test payment with test card
5. Verify booking creation

## 6. Troubleshooting

- **Payment fails**: Check Razorpay keys and backend logs
- **Order creation fails**: Verify backend is running and accessible
- **Booking not created**: Check payment verification in backend

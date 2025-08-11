# Razorpay Integration Setup

## Overview

This application integrates Razorpay for secure payment processing when booking sports courts.

## Setup Steps

### 1. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate a new key pair (Key ID and Key Secret)
4. Copy the Key ID for frontend use

### 2. Update Frontend Configuration

In `auth/src/pages/PaymentPage.tsx`, replace the placeholder key:

```typescript
// Replace this line:
key: 'rzp_test_YOUR_KEY_HERE',

// With your actual test key:
key: 'rzp_test_YOUR_ACTUAL_KEY_ID',
```

### 3. Backend Integration (Optional)

For production, you should integrate the actual Razorpay API in the backend:

1. Install Razorpay package:

```bash
cd server
npm install razorpay
```

2. Update `server/controllers/bookingController.js`:

```javascript
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      message: "Order created successfully",
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create payment order",
    });
  }
};
```

3. Add environment variables to `.env`:

```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 4. Test Mode

- Use test keys for development
- Test card numbers:
  - Success: 4111 1111 1111 1111
  - Failure: 4000 0000 0000 0002
  - Expiry: Any future date
  - CVV: Any 3 digits

### 5. Production Deployment

- Replace test keys with live keys
- Ensure HTTPS is enabled
- Set up webhook endpoints for payment verification
- Implement proper error handling and logging

## Current Implementation

The current implementation includes:

- ✅ Frontend payment page with Razorpay integration
- ✅ Backend order creation endpoint
- ✅ Booking creation after successful payment
- ✅ Payment verification and booking confirmation
- ✅ Error handling and user feedback

## Security Notes

- Never expose your Razorpay secret key in frontend code
- Always verify payments on the backend
- Implement webhook verification for production
- Use environment variables for sensitive data
- Enable HTTPS in production

## Troubleshooting

- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Ensure Razorpay script loads correctly
- Check network tab for failed requests
- Verify payment amount is in paise (multiply by 100)

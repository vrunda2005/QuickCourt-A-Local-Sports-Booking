// Razorpay configuration
export const RAZORPAY_CONFIG = {
  // Test keys - Replace with your actual Razorpay keys
  key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
  secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'YOUR_SECRET_KEY',
  
  // Production keys (when ready)
  // key: import.meta.env.VITE_RAZORPAY_LIVE_KEY_ID || 'rzp_live_YOUR_LIVE_KEY',
  // secret: import.meta.env.VITE_RAZORPAY_LIVE_KEY_SECRET || 'YOUR_LIVE_SECRET_KEY',
  
  currency: 'INR',
  name: 'QuickCourt',
  description: 'Sports Court Booking',
  theme: {
    color: '#10B981'
  }
};

// Environment variables needed:
// VITE_RAZORPAY_KEY_ID=rzp_test_your_test_key_here
// VITE_RAZORPAY_KEY_SECRET=your_test_secret_key_here
// VITE_RAZORPAY_LIVE_KEY_ID=rzp_live_your_live_key_here (for production)
// VITE_RAZORPAY_LIVE_KEY_SECRET=your_live_secret_key_here (for production)

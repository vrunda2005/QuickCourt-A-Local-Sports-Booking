// PaymentPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

interface BookingDetails {
  venueId: string;
  venueName: string;
  sport: string;
  court: string;
  durationHrs: number;
  startTime: string;
  endTime: string;
  date: string;
  price: number;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const PaymentPage = () => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockPayment, setIsMockPayment] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking details from location state or URL params
  const getBookingDetails = (): BookingDetails | null => {
    if (location.state?.bookingDetails) {
      return location.state.bookingDetails;
    }

    // Fallback: try to get from URL params
    const params = new URLSearchParams(location.search);
    const venueId = params.get('venueId');
    const venueName = params.get('venueName');
    const sport = params.get('sport');
    const court = params.get('court');
    const durationHrs = params.get('durationHrs');
    const startTime = params.get('startTime');
    const endTime = params.get('endTime');
    const date = params.get('date');
    const price = params.get('price');

    if (
      venueId &&
      venueName &&
      sport &&
      court &&
      durationHrs &&
      startTime &&
      endTime &&
      date &&
      price
    ) {
      return {
        venueId,
        venueName,
        sport,
        court,
        durationHrs: parseInt(durationHrs),
        startTime,
        endTime,
        date,
        price: parseInt(price),
      };
    }

    return null;
  };

  const [bookingDetails] = useState<BookingDetails | null>(getBookingDetails());

  useEffect(() => {
    if (!bookingDetails) {
      setError('No booking details found. Please go back and try again.');
    }
  }, [bookingDetails]);

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => {
        setError('Failed to load Razorpay. Please check your internet connection.');
      };
      document.body.appendChild(script);
    });
  };

  const createOrder = async (): Promise<{ orderId: string; isMock: boolean }> => {
    try {
      const token = await getToken();
      const response = await axios.post(
        'http://localhost:5000/api/bookings/create-order',
        {
          amount: bookingDetails!.price * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: `booking_${Date.now()}`,
          notes: {
            venueId: bookingDetails!.venueId,
            sport: bookingDetails!.sport,
            court: bookingDetails!.court,
            date: bookingDetails!.date,
            startTime: bookingDetails!.startTime,
            endTime: bookingDetails!.endTime,
            durationHrs: bookingDetails!.durationHrs,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        return {
          orderId: response.data.orderId,
          isMock: response.data.isMock || false,
        };
      } else {
        throw new Error(response.data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create payment order');
    }
  };

  const handlePayment = async () => {
    if (!bookingDetails) return;

    try {
      setPaymentLoading(true);
      setError(null);

      // Create order
      const { orderId, isMock } = await createOrder();
      setIsMockPayment(isMock);

      // Handle mock payment
      if (isMock) {
        console.log('🔧 Using mock payment system');

        // Show loading message
        setPaymentLoading(true);

        // Simulate payment processing
        setTimeout(async () => {
          try {
            // Create booking directly
            const token = await getToken();
            const bookingResponse = await axios.post(
              'http://localhost:5000/api/bookings',
              {
                facility: bookingDetails.venueId,
                court: bookingDetails.court,
                date: bookingDetails.date,
                startTime: bookingDetails.startTime,
                endTime: bookingDetails.endTime,
                totalAmount: bookingDetails.price,
                paymentId: `mock_payment_${Date.now()}`,
                orderId: orderId,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (bookingResponse.data.success) {
              alert('✅ Mock payment successful! Your court has been booked.');
              navigate('/my-bookings');
            } else {
              setError('❌ Mock payment successful but booking failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error creating booking:', error);
            setError('❌ Mock payment successful but booking failed. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        }, 2000); // Simulate 2 second payment processing

        return;
      }

      // Handle real Razorpay payment
      await loadRazorpayScript();

      const options = {
        key: 'rzp_test_FoaXowU2Wl2ngT', // Your actual Razorpay key
        amount: bookingDetails.price * 100,
        currency: 'INR',
        name: 'QuickCourt',
        description: `Booking: ${bookingDetails.sport} at ${bookingDetails.venueName}`,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const token = await getToken();
            const verifyResponse = await axios.post(
              'http://localhost:5000/api/bookings/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!verifyResponse.data.success) {
              setError('❌ Payment verification failed. Please contact support.');
              return;
            }

            // Create booking after payment verification
            const bookingResponse = await axios.post(
              'http://localhost:5000/api/bookings',
              {
                facility: bookingDetails.venueId,
                court: bookingDetails.court,
                date: bookingDetails.date,
                startTime: bookingDetails.startTime,
                endTime: bookingDetails.endTime,
                totalAmount: bookingDetails.price,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (bookingResponse.data.success) {
              alert('✅ Payment successful! Your court has been booked.');
              navigate('/my-bookings');
            } else {
              setError('❌ Payment successful but booking failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            setError('❌ Payment successful but booking failed. Please contact support.');
          }
        },
        prefill: {
          name: 'User Name', // You can get this from Clerk user data
          email: 'user@example.com', // You can get this from Clerk user data
          contact: '9999999999',
        },
        theme: {
          color: '#10B981',
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Error</h2>
          <p className="text-gray-600 mb-6">{error || 'No booking details found'}</p>
          <button
            onClick={() => navigate('/venues')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
            <p className="text-blue-100">Secure payment powered by Razorpay</p>
            {isMockPayment && (
              <div className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm inline-block">
                🔧 Mock Payment Mode (Testing)
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">{bookingDetails.venueName}</h3>
                  <p className="text-sm text-gray-600">{bookingDetails.sport}</p>
                  <p className="text-sm text-gray-600">Court: {bookingDetails.court}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{bookingDetails.date}</p>
                  <p className="text-sm text-gray-600">
                    {bookingDetails.startTime} - {bookingDetails.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {bookingDetails.durationHrs} hour{bookingDetails.durationHrs > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Court Rate (per hour)</span>
                <span className="text-gray-900">
                  ₹{Math.round(bookingDetails.price / bookingDetails.durationHrs)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-900">
                  {bookingDetails.durationHrs} hour{bookingDetails.durationHrs > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="text-gray-900">₹0</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{bookingDetails.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {paymentLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isMockPayment ? 'Processing Mock Payment...' : 'Processing Payment...'}
                </>
              ) : (
                <>Pay ₹{bookingDetails.price} & Book Court</>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-red-500 text-xl mr-2">❌</div>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Info Message */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="text-blue-500 text-xl mr-2 mt-0.5">ℹ</div>
                <div>
                  <p className="text-blue-700 text-sm">
                    <strong>Test Mode:</strong> This is a test environment. Use test card numbers for payment testing.
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    Success: 4111 1111 1111 1111 | Failure: 4000 0000 0000 0002
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

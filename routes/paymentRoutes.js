const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create an order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // ✅ Payment verified
    // Save booking in DB here
await Booking.create({
  user: req.user.id, // if using auth
  facility: req.body.facilityId,
  court: req.body.courtId,
  date: req.body.date,
  time: req.body.time,
  paymentId: razorpay_payment_id,
  status: "Confirmed"
});

    return res.json({ success: true, message: "Payment verified" });


  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

module.exports = router;

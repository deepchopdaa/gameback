const express = require("express");
const Rezorpay = require("razorpay")
const crypto = require("crypto")
const dotenv = require("dotenv")

dotenv.config();
const Router = express.Router();

// Initialize Razorpay
const razorpay = new Rezorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
/* 
console.log(process.env.RAZORPAY_KEY_ID, " --- Key - id")
console.log(process.env.RAZORPAY_KEY_SECRET, " --- Secret Key") */

// Create Order Route

Router.post("/create-order", async (req, res) => {
  try {
    console.log("Create Order Api Called")
    const { amount, currency } = req.body;
    console.log(req.body)
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paisa
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    console.log(options, "<-- option -->")
    const order = await razorpay.orders.create(options);
    console.log(order, " -- order  -- ")
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Verify Payment Route
Router.post("/verify-payment", async (req, res) => {
  try {

    console.log("Payment verify api called")
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(req.body)
    const hmac = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (hmac === razorpay_signature) {
      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ error: "Payment verification failed!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});


module.exports = Router
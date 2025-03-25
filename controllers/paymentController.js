const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const stripe = Stripe("sk_test_51QplFuGdMatXIonZRXvniiBMOFF6uxTW5dsSHgV9NC0XQvPwyoV0xfhZGqm8zaJgQL7Qb1wmJuWjKIcrRsPybthr00R8PupW28");

router.use(express.json()); // Middleware to parse JSON body

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: priceId, // Product Price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `http://localhost:3100/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve Payment Session Status
router.get("/session-status", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.json({
      status: session.status,
      customer_email: session.customer_details?.email || "N/A"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

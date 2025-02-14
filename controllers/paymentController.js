// This is your test secret API key.
const stripe = require('stripe')('sk_test_51QplFuGdMatXIonZRXvniiBMOFF6uxTW5dsSHgV9NC0XQvPwyoV0xfhZGqm8zaJgQL7Qb1wmJuWjKIcrRsPybthr00R8PupW28');
const express = require('express');
const app = express();
const Router = express.Router();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000/';

Router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1QqBpIGdMatXIonZTTIirTEI',
        quantity: 1,
      },    
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}payment/success`,
    cancel_url: `${YOUR_DOMAIN}payment/cancel`,
});
  console.log(session)
  /* res.redirect(303, session.url); */
  console.log("-----------------------------");
  console.log(session.url)
  res.send(session)
});

Router.get("/success",async (req,res)=>{
  res.send("Payment successful")
})
Router.get("/cancel",async (req,res)=>{
  res.send("Payment cancel")
})


module.exports = Router;
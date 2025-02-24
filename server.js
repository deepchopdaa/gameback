const express = require("express");
const mongoose = require("mongoose")
const app = express();
require('./config/db.js')
const router = express.Router()
const cors = require('cors');
const category = require("./models/Category.js")

/* Route */
const adminRoute = require('./controllers/adminController.js')
const authRoute = require('./controllers/authController.js')
const categoryRoute = require('./controllers/categoryController.js')
const gameRoute = require('./controllers/gameController.js')
const PaymentRoute = require('./controllers/paymentController.js')
const reviewRoute = require('./controllers/reviewController.js')
const ticketRoute = require('./controllers/ticketController.js')
const userRoute = require('./controllers/userController.js')
const SendMail = require('./controllers/SendMail.js');
const PORT = process.env.PORT
app.use(cors());
app.use(express.json());

/* all api route */
app.use('/admin', adminRoute)
app.use('/auth', authRoute)
app.use('/category', categoryRoute)
app.use('/game', gameRoute)
app.use('/payment', PaymentRoute)
app.use('/review', reviewRoute)
app.use('/ticket', ticketRoute)
app.use('/user', userRoute)
app.use('/send', SendMail)
app.listen(3100, () => {
    console.log("app is running on 3100 port")
}) 
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
const Contact = require('./controllers/contact.js')
const UserPenel = require("./controllers/UserPenel.js")
const cart = require("./controllers/cartcontroller.js");
const slider = require("./controllers/SliderImage.js");


const PORT = process.env.PORT
app.use(cors());
app.use(express.json());
/* file multer */
app.use('/uploads', express.static('uploads'));
/* all api route */
app.use('/admin', adminRoute)
app.use('/auth', authRoute)
app.use('/category', categoryRoute)
app.use('/game', gameRoute)
app.use('/userpenel', UserPenel)
app.use('/cart', cart)
app.use('/payment', PaymentRoute)
app.use('/review', reviewRoute)
app.use('/ticket', ticketRoute)
app.use('/slider', slider)
app.use('/user', userRoute)
app.use('/send', SendMail)
app.use('/contact', Contact)


app.get('/', (req, res) => {
    res.send({
        message: "API running ....."
    })
})

app.listen(3100, () => {
    console.log("app is running on 3100 port")
})


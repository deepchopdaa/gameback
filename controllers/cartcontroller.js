const express = require("express");
const Router = express.Router();
const Cart = require("../models/Cart.js");
const Ticket = require("../models/Ticket.js")
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");


Router.get("/getcart", userVerify, async (req, res) => {
    try {
        let user = req.user;
        let id = user.id
        let data = await Cart.find({ user_id: id });
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send({ message: "Data Not Found" })
    }
})

let flag = true

const validateDate = (req, res, next) => {
    const { date } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(date).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        return res.send("Past Date are not allowed.");
    } else {
        flag = false
    }
    next();
};


const validateTime = (req, res, next) => {
    const { time_slot } = req.body;
    const now = new Date();
    const currentHours = now.getHours();
    console.log(currentHours)
    const inputHours = time_slot.split("-")[0];
    const Mode = time_slot.split(" ")[1];
    console.log(Mode)
    console.log(inputHours, "<---- input hours ---->")
    if (inputHours <= currentHours && flag == false) {
        if (Mode == "AM") {
            return res.send("Past times are not allowed.");
        }
    }
    next();
};

Router.post("/addcart", userVerify, validateDate, validateTime, async (req, res) => {
    try {
        let { Game_id, amount, time_slot, ticket, t_price, date } = req.body;
        console.log(req.body)
        const user = req.user;
        const user_id = user._id
        if (!user_id || !Game_id || !amount || !ticket || !date || !time_slot) {
            console.log("Enter all required fields");
            return res.status(400).send("Enter all required fields");
        }
        console.log(Game_id, time_slot, date)
        const NotAvailable = await Ticket.findOne({ Game_id, time_slot, date })
        console.log(NotAvailable, "<------- Ticket Already booked----->")
        if (NotAvailable) {
            return res.send("This Game is Already Booked for This Time")
        } else {
            const exist = await Cart.findOne({ user_id, Game_id, time_slot, date })
            if (exist) {
                exist.ticket += ticket,
                    exist.amount += amount
                await exist.save();
                console.log(exist, "<--- update Data cart that already exist ------->");
                return res.send(exist)
            } else {
                let data = await Cart.create({ user_id, Game_id, ticket, time_slot, t_price, date, amount });
                console.log(data);
                return res.send("Your Game Add In Ticket Menu");
            }
        }
    } catch (e) {
        return res.status(400).send("Add Ticket in to Menu is Not Successful")
    }

})
Router.put("/updatecart/:id", userVerify, async (req, res) => {
    try {
        let id = req.params.id;
        const user = req.user;
        const user_id = user._id
        let { Game_id, amount, time_slot, ticket, t_price, date } = req.body;
        if (user_id && Game_id && amount && ticket && time_slot && t_price && date) {
            let data = await Cart.findByIdAndUpdate(id, { user_id, Game_id, ticket, time_slot, t_price, date, amount }, { new: true });
            console.log(data);
            return res.send(data)
        } else {
            console.log("enter all required feild")
            return res.send("enter all required feild")
        }
    } catch (e) {
        return res.status(400).send("Cart Not Update Commplite")
    }
})

Router.delete("/deletecart/:id", userVerify, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await Cart.findByIdAndDelete({ _id: id });
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send("Delte Ticket Menu item Failed")
    }
})

Router.delete("/Checkout", userVerify, async (req, res) => {
    try {
        let user = req.user;
        console.log(user)
        let id = user._id
        console.log("User Id in Delete Cart", id)
        let data = await Cart.deleteMany({ user_id: id });
        console.log(data);
        return res.send(data);
    } catch (e) {
        console.log("Delete All item in Cart Error", e)
    }
})

/* for checkout sum of total */

Router.get("/getTotal", userVerify, async (req, res) => {
    try {
        console.log("Get Total Api called")
        const user = req.user;
        console.log(user, "user Detail for total get");
        let data = await Cart.find({ user_id: user._id });
        console.log(data);
        const total = data.reduce((sum, item) => sum + (item.amount || 0), 0)
        console.log(total)
        return res.status(200).send({total})
    } catch (e) {
        console.log("Get Total of Booking Game Error", e);
        return res.status(500).send("Get Total Error", e)
    }
})

module.exports = Router
const express = require("express");
const Router = express.Router();
const Cart = require("../models/Cart.js");
const Ticket = require("../models/Ticket.js")
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");


Router.get("/getcart", userVerify, async (req, res) => {
    let user = req.user;
    let id = user.id
    let data = await Cart.find({ user_id: id });
    res.send(data);
    console.log(data);
})


Router.post("/addcart", userVerify, async (req, res) => {
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
        return res.send("Your Game is Already Booked for This Time")
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
})
Router.put("/updatecart/:id", userVerify, async (req, res) => {
    let id = req.params.id;
    const user = req.user;
    const user_id = user._id
    let { Game_id, amount, time_slot, ticket, t_price, date } = req.body;
    if (user_id && Game_id && amount && ticket && time_slot && t_price && date) {
        let data = await Cart.findByIdAndUpdate(id, { user_id, Game_id, ticket, time_slot, t_price, date, amount }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.delete("/deletecart/:id", userVerify, async (req, res) => {
    let id = req.params.id;
    let data = await Cart.findByIdAndDelete({ _id: id });
    console.log(data);
    res.send(data);
})

Router.delete("/Checkout", userVerify, async (req, res) => {
    try {
        let user = req.user;
        console.log(user)
        let id = user._id
        console.log("User Id in Delete Cart", id)
        let data = await Cart.deleteMany({ user_id: id });
        console.log(data);
        res.send(data);
    } catch (e) {
        console.log("Delete All item in Cart Error", e)
    }
})

module.exports = Router
const express = require("express");
const Router = express.Router();
const Cart = require("../models/Cart.js");
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");

Router.get("/getcart", userVerify, async (req, res) => {
    let user = req.user;
    let id = user.id
    let data = await Cart.find({user_id:id});
    res.send(data);
    console.log(data);
})


Router.post("/addcart", userVerify, async (req, res) => {
    let { Game_id, amount, time_slot, ticket, t_price } = req.body;
    console.log(req.body)
    const user= req.user;
    const user_id= user._id
    if (user_id && Game_id && amount && ticket && time_slot) {
        let data = await Cart.create({ user_id, Game_id, ticket, time_slot, t_price, amount });
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})
Router.put("/updatecart/:id", userVerify, async (req, res) => {
    let id = req.params.id;
    const user= req.user;
    const user_id= user._id
    let { Game_id, amount, time_slot, ticket, t_price } = req.body;
    if (user_id && Game_id && amount && ticket && time_slot && t_price) {
        let data = await Cart.findByIdAndUpdate(id, { user_id, Game_id, ticket, time_slot, t_price, amount }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.delete("/deletecart/:id", userVerify, async (req, res) => {
    let id = req.params.id;
    let data = await Cart.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})

module.exports = Router
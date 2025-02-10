const express = require("express");
const Router = express.Router();
const Ticket = require("../models/Ticket.js");
const authVerify = require('../middleware/authMiddleware.js')

Router.get("/getticket",authVerify, async (req, res) => {
    let data = await Ticket.find();
    res.send(data);
    console.log(data);
})

Router.post("/addticket",authVerify, async (req, res) => {
    let { user_id, Game_id, price } = req.body;
    if (user_id && Game_id && price) {
        let data = await Ticket.create({ user_id, Game_id, price });
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.put("/updateticket/:id",authVerify, async (req, res) => {
    let id = req.params.id;
    let { user_id, Game_id, price } = req.body;
    if (user_id && Game_id && price) {
        let data = await Ticket.findByIdAndUpdate(id, { user_id, Game_id, price }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})


Router.delete("/deleteticket/:id",authVerify, async (req, res) => {
    let id = req.params.id;
    let data = await Ticket.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})


module.exports = Router
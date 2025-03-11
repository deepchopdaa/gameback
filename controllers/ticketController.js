const express = require("express");
const Router = express.Router();
const Ticket = require("../models/Ticket.js");
const authVerify = require('../middleware/authMiddleware.js')

Router.get("/getticket", authVerify, async (req, res) => {
    let data = await Ticket.find();
    res.send(data);
    console.log(data);
})


/* for Add To Cart Menu Record Insert */
Router.post("/addticket", async (req, res) => {
    try {
        const { user_id, Game_id, amount, SeatNumber } = req.body;

        if (!user_id || !Game_id || !amount || !SeatNumber) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let data = await Ticket.create({ user_id, Game_id, SeatNumber, amount });
        console.log("New Ticket Created:", data);
        res.status(201).json(data);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ error: "Server error" });
    }
});


Router.put("/updateticket/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let { user_id, Game_id, amount, SeatNumber } = req.body;
    if (user_id && Game_id && amount && SeatNumber) {
        let data = await Ticket.findByIdAndUpdate(id, { user_id, Game_id, SeatNumber, amount }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.delete("/deleteticket/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let data = await Ticket.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})

module.exports = Router
const express = require("express");
const Router = express.Router();
const Game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const path = require("path")
const fs = require("fs")
const upload = require("../middleware/uploadMiddleware.js");
const userVerify = require("../middleware/UserMiddleware.js");
const Review = require("../models/Review.js")
const Ticket = require("../models/Ticket.js")



Router.get("/productDetail/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        let data = await Game.findById(req.params.id);
        console.log(data);
        return res.send(data)
    } catch (e) {
        console.log(e)
        res.status(404).json({
            error: "Game Details Not Found"
        })
    }
})

Router.post("/addreview", userVerify, async (req, res) => {
    try {
        let { Game_id, rating, comment } = req.body;
        const user = req.user
        const user_id = user
        console.log(req.body)

        const ticket = await Ticket.findOne({ user_id, Game_id });

        if (!ticket) {
            return res.send("This Game Is Not Booked By You Before So you Cant Submit Review");
        }
        console.log(ticket, "<--Ticket Found -->")

        if (user_id && Game_id && rating && comment) {
            let data = await Review.create({ user_id, Game_id, rating, comment });
            console.log(data);
            return res.send(data);
        } else {
            res.send("enter all required feild")
            console.log("enter all required feild")
        }
    } catch (e) {
        return res.status(400).send("Cant Add Review !")
    }
})

module.exports = Router
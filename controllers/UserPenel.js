const express = require("express");
const Router = express.Router();
const Game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const path = require("path")
const fs = require("fs")
const upload = require("../middleware/uploadMiddleware.js");
const userVerify = require("../middleware/UserMiddleware.js");
const Review = require("../models/Review.js")


Router.get("/productDetail/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        let data = await Game.findById(req.params.id);
        console.log(data);
        res.send(data)
    } catch (e) {   
        console.log(e)
        res.status(404).json({
            error: "Game Details Not Found"
        })
    }   
}) 

Router.post("/addreview", userVerify, async (req, res) => {
    let { Game_id, rating, comment } = req.body;
    const user = req.user
    const user_id = user
    console.log(req.body)
    if (user_id && Game_id && rating && comment) {
        let data = await Review.create({ user_id, Game_id, rating, comment });
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})


module.exports = Router
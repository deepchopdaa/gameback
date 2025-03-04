const express = require("express");
const Router = express.Router();
const Review = require("../models/Review.js");
const authVerify = require('../middleware/authMiddleware.js')
Router.get("/getreview",authVerify, async (req, res) => {
    let data = await Review.find();
    res.send(data);
    console.log(data);
})

Router.post("/addreview",authVerify, async (req, res) => {
    let { user_id, Game_id, rating, comment, date } = req.body;
    if (user_id && Game_id && rating && comment) {
        let data = await Review.create({ user_id, Game_id, rating, comment, date });
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.put("/updatereview/:id",authVerify, async (req, res) => {
    let id = req.params.id;
    let { user_id, Game_id, rating, comment, date } = req.body;
    if (user_id && Game_id && rating && comment) {
        let data = await Review.findByIdAndUpdate(id, { user_id, Game_id, rating, comment, date }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.delete("/deletereview/:id",authVerify, async (req, res) => {
    let id = req.params.id;
    let data = await Review.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})

module.exports = Router
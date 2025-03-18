const express = require("express");
const Router = express.Router();
const Review = require("../models/Review.js");
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");
Router.get("/getreview", authVerify, async (req, res) => {
    let data = await Review.find().sort({date:-1});;
    res.send(data);
    console.log(data);
})
Router.get("/getuserreview", async (req, res) => {
    let data = await Review.find();
    res.send(data);
    console.log(data);
})
Router.get("/getGamereview/:id", async (req, res) => {
    const id = req.params.id
    let data = await Review.find({ Game_id: id });
    res.send(data);
    console.log(data);
})

/* Get Review for product details page perticulor game */

Router.get("/getdetailreview/:id", userVerify, async (req, res) => {
    try {
        const id = req.params.id;
        let data = await Review.find({ Game_id: id })
        if (!data) {
            return res.send("This Game Review Not Available")
        } else {
            return res.send(data)
        }
    } catch (e) {
        return res.status(404).send("Error Catching During perticulor Game Review Getting", e);
    }
})

Router.post("/addreview", authVerify, async (req, res) => {
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

Router.put("/updatereview/:id", authVerify, async (req, res) => {
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

Router.delete("/deletereview/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let data = await Review.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})

module.exports = Router
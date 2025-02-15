const express = require("express");
const Router = express.Router();
const Game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const upload = require("../middleware/uploadMiddleware.js")
Router.get("/getGame",authVerify, async (req, res) => {
    let data = await Game.find();
    res.send(data);
    console.log(data);
})

Router.post("/addGame",authVerify, async (req, res) => {
    let { title, category, description, price, image, rating } = req.body;
    if (title && category && description && price && image && rating) {
        let data = await Game.create({ title, category, description, price, image, rating });
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild") 
    }   
})

Router.put("/updateGame/:id",authVerify, async (req, res) => {
    let id = req.params.id;
    let { title, category, description, price, image, rating } = req.body;
    if (title && category && description && price && image && rating) {
        let data = await Game.findByIdAndUpdate(id, { title, category, description, price, image, rating }, { new: true });
        console.log(data);
        res.send(data)      
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.delete("/deleteGame/:id",authVerify, async (req, res) => {
    let id = req.params.id
    let data = await Game.findByIdAndDelete(id)
    console.log(data)
    res.send(data)
})

module.exports = Router
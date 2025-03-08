const express = require("express");
const Router = express.Router();
const Game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const path = require("path")
const fs = require("fs")
const upload = require("../middleware/uploadMiddleware.js");
const userVerify = require("../middleware/UserMiddleware.js");



Router.get("/productDetail/:id",userVerify, async (req, res) => {
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












module.exports = Router
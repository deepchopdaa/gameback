const express = require("express");
const Router = express.Router();
const Game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const fs = require("fs")
const upload = require("../middleware/uploadMiddleware.js")


/* Router.post("/addGame", async (req, res) => {
    let { title, category, description, price, image, rating } = req.body;
    if (title && category && description && price && image && rating) {
        let data = await Game.create({ title, category, description, price, image, rating });
const path = require("path")
const { ifError } = require("assert");
const { error } = require("console"); */


Router.get("/getGame", async (req, res) => {
    try {
        let data = await Game.find();
        console.log(data);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "server error"
        })
    }
})

Router.post("/addGame", upload.single('image'), async (req, res) => {
    try {
        let { title, category, description, price, rating } = req.body;
        console.log(req.body)
        if (!title || !category || !description || !price || !rating) {
            console.log("enter require field")
            return res.status(400).json({ error: "Enter all required fields" });
        }
        const newGame = await Game.create({
            title,
            category,
            description,
            price,
            image: req.file.path, // Store file path
            rating,
        });
        res.status(201).json(newGame);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "server error"
        })
    }
})

Router.put("/updateGame/:id", upload.single('image'), async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id)
        let { title, category, description, price, rating } = req.body;
        console.log(title, category, description, price, rating, "title, category, description, price, image: updateImage, rating")
        if (!title || !category || !description || !price || !rating) {
            return res.status(400).json({ error: "Enter all Required Field" })
        }
        let existringGame = await Game.findByIdAndUpdate(id);
        if (!existringGame) {
            return res.status(400).json({
                error: "Game not Found"
            })
        }
        console.log(existringGame.image);
        let updateImage = existringGame.image
        if (req.file) {
            console.log(req.file + "|fdfgdrgrdgrdg")
            updateImage = req.file.path;
            console.log(updateImage, "fsfesfs")
            if (existringGame.image) {
                fs.unlink(existringGame.image, (err) => {
                    if (!err) console.log("Error old image delete :", err);
                })
            }
        }
        let updateGame = await Game.findByIdAndUpdate(id, { title, category, description, price, image: updateImage, rating }, { new: true })
        res.status(200).json(updateGame)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "server error"
        })
    }

})

Router.delete("/deleteGame/:id", async (req, res) => {
    try {
        let id = req.params.id
        console.log(req.body)
        let deleteimage = req.file.path
        if (deleteimage) {
            fs.unlink(deleteimage, (e) => {
                console.log("Error image Delete", e)
            })
        }
        let DeleteGame = await Game.findByIdAndDelete(id)
        res.status(200).json(DeleteGame)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "server error"
        })
    }
    /*    let id = req.params.id
       let data = await Game.findByIdAndDelete(id)
       console.log(data)
       res.send(data) */
})

module.exports = Router
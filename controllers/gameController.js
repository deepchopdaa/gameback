const express = require("express");
const Router = express.Router();
const Game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const path = require("path")
const fs = require("fs")
const upload = require("../middleware/uploadMiddleware.js");
const userVerify = require("../middleware/UserMiddleware.js");

Router.get("/getCategoryGame/:id", async (req, res) => {
    try {
        const id = req.params.id
        let data = await Game.find({ category: id });
        console.log(data);
        console.log("< ------ Game Get By Category --- >")
        return res.send(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: "server error"
        })
    }
})




/* for Game Detail */
Router.get("/getUserGame", async (req, res) => {
    try {
        let data = await Game.find();
        console.log(data);
        console.log("<------- All game getting ---->")
        return res.send(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: "server error"
        })
    }
})

/* polulor  */
Router.get("/getpopulor", async (req, res) => {
    try {
        let data = await Game.find().sort({price:-1}).limit(5);
        console.log(data);
        console.log("<------- All game getting ---->")
        return res.send(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: "server error"
        })
    }
})

/* for add To Cart Menu */
Router.post("/getcartGame", async (req, res) => {
    try {
        const { gameIds } = req.body; // Extract gameIds array from request body
        console.log(gameIds, "Games id");
        console.log(req.body, "req body");

        if (!Array.isArray(gameIds) || gameIds.length === 0) {
            return res.status(400).json({ error: "Invalid or empty gameIds array" });
        }

        // Fetch all matching records
        let data = await Game.find({ _id: { $in: gameIds } });

        // Ensure the response matches the exact gameIds count (including duplicates)
        const gameMap = data.reduce((acc, game) => {
            acc[game._id.toString()] = game; // Store each game by ID
            return acc;
        }, {});

        const orderedData = gameIds.map(id => gameMap[id] || null); // Preserve order & duplicates

        console.log(orderedData, "Ordered Games Data");
        return res.json(orderedData);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Server error" });
    }
});

/* Admin Route */

Router.get("/getGame", authVerify, async (req, res) => {
    try {
        let data = await Game.find();
        console.log(data);
        return res.send(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: "server error"
        })
    }
})


Router.post("/addGame", authVerify, upload.single('image'), async (req, res) => {
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
        return res.status(201).json(newGame);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: "server error"
        })
    }
})


Router.put("/updateGame/:id", authVerify, upload.single("image"), async (req, res) => {
    try {
        let id = req.params.id;
        console.log("Update Request for ID:", id);
        console.log(req.body)
        let { title, category, description, price, rating } = req.body;
        if (!title || !category || !description || !price || !rating) {
            return res.status(400).json({ error: "Enter all required fields" });
        }
        
        // Step 1: Find the existing game
        let existingGame = await Game.findById(id);
        if (!existingGame) {
            return res.status(404).json({ error: "Game not found" });
        }

        console.log("Existing Game Image:", existingGame.image);

        // Step 2: Manage Image (Delete Old One if New One is Uploaded)
        let updatedImage = existingGame.image; // Keep old image if no new image is uploaded

        if (req.file) {
            updatedImage = req.file.path; // New uploaded image path

            // Delete old image if it exists
            if (existingGame.image) {
                const oldImagePath = path.join(__dirname, "../", existingGame.image); // Ensure correct path
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    } else {
                        console.log("Old image deleted successfully:", oldImagePath);
                    }
                });
            }
        }

        // Step 3: Update game details in the database
        let updatedGame = await Game.findByIdAndUpdate(
            id,
            { title, category, description, price, rating, image: updatedImage },
            { new: true } // Returns updated document
        );

        return res.status(200).json({ message: "Game updated successfully", updatedGame });
    } catch (error) {
        console.error("Error updating game:", error);
        return res.status(500).json({ error: "Server error" });
    }
});



Router.delete("/deleteGame/:id", authVerify, async (req, res) => {
    try {
        let id = req.params.id;
        console.log("Delete request received for ID:", id);

        // Step 1: Find the game by ID
        let game = await Game.findById(id);
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        // Step 2: Delete the associated image (if exists)
        if (game.image) {
            let imagePath = path.join(__dirname, "../uploads", game.image); // Adjust the path accordingly
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                } else {
                    console.log("Image deleted successfully:", imagePath);
                }
            });
        }
        // Step 3: Delete the game record from the database
        let deletedGame = await Game.findByIdAndDelete(id);

        return res.status(200).json({ message: "Game deleted successfully", deletedGame });
    } catch (error) {
        console.error("Error deleting game:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = Router
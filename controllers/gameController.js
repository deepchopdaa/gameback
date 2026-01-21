const express = require("express");
const Router = express.Router();
const Game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const path = require("path")
const fs = require("fs")
const upload = require("../middleware/uploadMiddleware.js");
const userVerify = require("../middleware/UserMiddleware.js");
const cloudinary = require("../middleware/Cloudinary.js");

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
        let data = await Game.find().sort({ price: -1 }).limit(5);
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
        let data = await Game.find().sort({ _id: -1 });
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
        const { title, category, description, price, rating } = req.body;

        if (!title || !category || !description || !price || !rating) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        // Convert buffer → base64
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: "games",
        });

        const newGame = await Game.create({
            title,
            category,
            description,
            price,
            rating,
            image: uploadResult.secure_url, // ✅ URL ONLY
        });

        return res.status(201).json({
            success: true,
            message: "Game added successfully",
            game: newGame,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
})


Router.put("/updateGame/:id", authVerify, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, price, rating } = req.body;

        if (!title || !category || !description || !price || !rating) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingGame = await Game.findById(id);
        if (!existingGame) {
            return res.status(404).json({ error: "Game not found" });
        }

        let updatedImage = existingGame.image;

        // If new image uploaded
        if (req.file) {
            // ⚠️ Delete old image (best-effort)
            /*     if (existingGame.image) {
                    try {
                        const publicId = existingGame.image
                            .split("/")
                            .slice(-1)[0]
                            .split(".")[0];
    
                        await cloudinary.uploader.destroy(`games/${publicId}`);
                    } catch (err) {
                        console.warn("Old image delete skipped:", err.message);
                    }
                } */

            // Upload new image
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

            const uploadResult = await cloudinary.uploader.upload(base64Image, {
                folder: "games",
            });
            console.log("Cloudinary keys:", Object.keys(cloudinary));
            console.log(uploadResult, "responce")
            updatedImage = uploadResult.secure_url;
        }

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            {
                title,
                category,
                description,
                price,
                rating,
                image: updatedImage,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Game updated successfully",
            game: updatedGame,
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});



Router.delete("/deleteGame/:id", authVerify, async (req, res) => {
    try {
        const { id } = req.params;

        const game = await Game.findById(id);
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        // Delete image from Cloudinary (best-effort)
        if (game.image) {
            try {
                const publicId = game.image
                    .split("/")
                    .slice(-1)[0]
                    .split(".")[0];

                await cloudinary.uploader.destroy(`games/${publicId}`);
            } catch (err) {
                console.warn("Cloudinary delete skipped:", err.message);
            }
        }

        const deletedGame = await Game.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Game deleted successfully",
            game: deletedGame,
        });
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = Router
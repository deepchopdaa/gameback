const express = require("express");
const Router = express.Router();

const Slider = require("../models/Slider.js");
const upload = require("../middleware/uploadMiddleware.js");
const cloudinary = require("../config/cloudinary.js");

/**
 * GET ALL SLIDER IMAGES
 */
Router.get("/getimage", async (req, res) => {
    try {
        const data = await Slider.find().sort({ _id: -1 });
        return res.status(200).json(data);
    } catch (error) {
        console.error("Slider Fetch Error:", error);
        return res.status(500).json({ error: "Slider Get Failed" });
    }
});

/**
 * CREATE SLIDER IMAGE
 */
Router.post("/sendimage", upload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({ error: "Title and image are required" });
        }

        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
        )}`;

        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: "sliders",
        });

        const data = await Slider.create({
            title,
            image: uploadResult.secure_url,
        });

        return res.status(201).json(data);
    } catch (error) {
        console.error("Slider Upload Error:", error);
        return res.status(500).json({ error: "Slider Insert Failed" });
    }
});

/**
 * UPDATE SLIDER IMAGE
 */
Router.put("/updateimage/:id", upload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
        const { id } = req.params;

        const existing = await Slider.findById(id);
        if (!existing) {
            return res.status(404).json({ error: "Record Not Found" });
        }

        let updatedImage = existing.image;

        if (req.file) {
            // Delete old image (best-effort)
            try {
                const publicId = existing.image
                    .split("/")
                    .slice(-1)[0]
                    .split(".")[0];

                await cloudinary.uploader.destroy(`sliders/${publicId}`);
            } catch (err) {
                console.warn("Old slider image delete skipped");
            }

            // Upload new image
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
                "base64"
            )}`;

            const uploadResult = await cloudinary.uploader.upload(base64Image, {
                folder: "sliders",
            });

            updatedImage = uploadResult.secure_url;
        }

        const updatedData = await Slider.findByIdAndUpdate(
            id,
            { title, image: updatedImage },
            { new: true, runValidators: true }
        );

        return res.status(200).json(updatedData);
    } catch (error) {
        console.error("Slider Update Error:", error);
        return res.status(500).json({ error: "Slider Update Failed" });
    }
});

/**
 * DELETE SLIDER IMAGE
 */
Router.delete("/deleteimage/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Slider.findById(id);
        if (!existing) {
            return res.status(404).json({ error: "Record Not Found" });
        }

        // Delete image from Cloudinary (best-effort)
        try {
            const publicId = existing.image
                .split("/")
                .slice(-1)[0]
                .split(".")[0];

            await cloudinary.uploader.destroy(`sliders/${publicId}`);
        } catch (err) {
            console.warn("Slider image delete skipped");
        }

        const data = await Slider.findByIdAndDelete(id);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Slider Delete Error:", error);
        return res.status(500).json({ error: "Slider Delete Failed" });
    }
});

module.exports = Router;

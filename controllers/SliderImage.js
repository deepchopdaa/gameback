const express = require('express');
const Router = express.Router();
const fs = require('fs')
const Slider = require("../models/Slider.js")
const path = require("path")
const upload = require("../middleware/uploadMiddleware.js");
Router.get("/getimage", async (req, res) => {
    try {
        let data = await Slider.find();
        console.log(data, "images slider");
        return res.send(data)
    } catch (e) {
        console.log("Slider Data Getting Error")
        return res.send("Slider Get Failed", e)
    }   
})

Router.post("/sendimage", upload.single('image'), async (req, res) => {
    try {
        const { title } = req.body;
        console.log(title)
        if (!title) {
            console.log("enter require field")
            return res.status(400).json({ error: "Enter all required fields" });
        }
        let data = await Slider.create({ title, image: req.file.path });
        console.log(data)
        return res.send(data)
    } catch (e) {
        console.log("Image Upload Error");
        return res.send("Data Insert Failed")
    }
})

Router.put("/updateimage/:id", upload.single('image'), async (req, res) => {
    try {
        const { title } = req.body;
        const id = req.params.id
        console.log(id)
        let existing = await Slider.findById(id);
        if (!existing) {
            return res.status(400).send("Record Not Found")
        }
        console.log("Existing Slider Record", existing);
        let updatedImage = existing.image;
        if (req.file) {
            updatedImage = req.file.path;
            console.log(updatedImage)
            if (existing.image) {
                fs.unlink(existing.image, (err) => {
                    if (err) {
                        console.error("Error Deleting Old Image :", err)
                    } else {
                        console.log('Old Image Deleted Successfully ', existing.image)
                    }
                })
            }
        }
        let UpdatedData = await Slider.findByIdAndUpdate(
            id,
            { title, image: updatedImage },
            { new: true, runValidators: true }
        );
        if (!UpdatedData) {
            return res.status(500).send("Update Data Not Succesfull update")
        }
        console.log("Update data ", UpdatedData)
        return res.status(200).send(UpdatedData)
    } catch (e) {
        console.log("Slider Update Error");
        return res.send("Slider Update Failed")
    }
})

Router.delete("/deleteimage/:id", async (req, res) => {
    try {
        const id = req.params.id
        let existing = await Slider.findById(id);
        if (!existing) {
            return res.status(400).send("Record Not Found !")
        }
        let imagePath = path.join(__dirname, "../uploads", existing.image);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Image Not Deleted");
            } else {
                console.log("Image Deleted Successfuly")
            }
        })
        let data = await Slider.findByIdAndDelete(id);
        console.log(data, "<---delete record -->")
        return res.send(data)
    } catch (e) {
        console.log('Slider Delete Record Error')
        return res.send("Data Delete Failed")
    }
})

module.exports = Router
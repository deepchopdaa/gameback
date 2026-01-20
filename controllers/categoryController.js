const express = require("express");
const Router = express.Router();
const category = require("../models/Category.js");
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");

Router.get("/getcategory", authVerify, async (req, res) => {
    try {
        let data = await category.find().sort({ _id: -1 });
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send("Category Cant Load !")
    }
})

Router.post("/addcategory", authVerify, async (req, res) => {
    try {
        let { name, description } = req.body;
        if (name && description) {
            let data = await category.create({ name, description });
            console.log(data);
            return res.send(data);
        } else {
            console.log("enter all required feild")
            return res.send("enter all required feild")
        }
    } catch (e) {
        return res.status(400).send("Add Category Failed !")
    }
})

Router.put("/updatecategory/:id", authVerify, async (req, res) => {
    try {
        let id = req.params.id;
        let { name, description } = req.body;
        if (name && description) {
            let data = await category.findByIdAndUpdate(id, { name, description }, { new: true });
            console.log(data);
            return res.send(data)
        } else {
            console.log("enter all required feild")
            return res.send("enter all required feild")
        }
    } catch (e) {
        return res.status(400).send("Update Category failed")
    }
})

Router.delete("/deletecategory/:id", authVerify, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await category.findByIdAndDelete(id);
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send("Can't Delete Category ")
    }
})

/* User Side Category Show */
Router.get("/getusercategory", async (req, res) => {
    try {

        let data = await category.find();
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send("User Side Category Cant Load !")
    }
})


Router.get("/getcategorylist", async (req, res) => {
    try {
        let data = await category.find().limit(5);
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

module.exports = Router 
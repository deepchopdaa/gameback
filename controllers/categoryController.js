const express = require("express");
const Router = express.Router();
const category = require("../models/Category.js");
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");

Router.get("/getcategory", authVerify, async (req, res) => {
    let data = await category.find();
    res.send(data);
    console.log(data);
})
Router.get("/getusercategory", async (req, res) => {
    let data = await category.find();
    res.send(data);
    console.log(data);
})

Router.post("/addcategory", authVerify, async (req, res) => {
    let { name, description } = req.body;
    if (name && description) {
        let data = await category.create({ name, description });
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.put("/updatecategory/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let { name, description } = req.body;
    if (name && description) {
        let data = await category.findByIdAndUpdate(id, { name, description }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.delete("/deletecategory/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let data = await category.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})


module.exports = Router 
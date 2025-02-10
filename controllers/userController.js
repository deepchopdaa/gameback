const express = require("express");
const Router = express.Router();
const User = require("../models/User.js");

Router.get("/getuser", async (req, res) => {
    let data = await User.find();
    res.send(data);
    console.log(data);
})

Router.put("/updateuser/:id", async (req, res) => {
    let id = req.params.id;
    let { name, email, password } = req.body;
    if (name && email && password) {
        let data = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild");
        console.log("enter all required feild");
    }
})

Router.delete("/deleteuser/:id", async (req, res) => {
    let id = req.params.id;
    let data = await User.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})

module.exports = Router
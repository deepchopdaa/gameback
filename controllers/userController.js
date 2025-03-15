const express = require("express");
const Router = express.Router();
const User = require("../models/User.js");
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");

Router.get("/getuser", authVerify, async (req, res) => {
    let data = await User.find();
    res.send(data);
    console.log(data);
})

Router.get("/getuserReview", userVerify, async (req, res) => {
    let data = await User.find();
    res.send(data);
    console.log(data);
})

/* smaple code */


/* Router.get("/getuser", authVerify, async (req, res) => {
    try {
        const userData = await User.find()
        if (userData.length > 0) {
            return res.json({
                status: 400,
                user: userData
            })
        } else {
            return res.json({
                status: 400,
                message: 'user data not available'
            })
        }
    } catch (error) {
        console.log(error, "get user error")
        return res.json({
            status: 500,
            messaage: "internal server error "
        })
    }
}) */


Router.put("/updateuser/:id", authVerify, async (req, res) => {
    let id = req.params.id
    let { name, email, password } = req.body;
    if (name && email && password) {
        let data = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        console.log(data)
        res.send(data)
    } else {
        res.send("enter all required feild");
        console.log("enter all required feild");
    }
})

Router.put("/updatestatus/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    console.log(id, "dgggggggggggtdhtdh");
    try {
        let user = await User.findById(id)
        if (!user) {
            console.log("User not Found")
        } else {
            console.log(user)
        }
        console.log(user.status)
        user.status = user.status === "Inactive" ? "active" : "Inactive";
        console.log(user.status)

        res.status(200).send(user)
    } catch (e) {
        res.status(500).send("server error")
    }
})

Router.delete("/deleteuser/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let data = await User.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})

module.exports = Router
const express = require("express");
const Router = express.Router();
const User = require("../models/User.js")
const jwt = require("jsonwebtoken")
const secrate_key = "secratekey"
const bcrypt = require('bcrypt');

Router.post("/register", async (req, res) => {
    console.log(req.body)
    try {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                return res.status(400).send(`An account with the email ${req.body.email} already exists`)
            } else {
                const password = req.body.password
                const hashpassword = async (password) => {
                    const round = 10;
                    const hashpassword = await bcrypt.hash(password, round)
                    return hashpassword
                }
                hashpassword(password)
                    .then(hashed => {
                        console.log("hashed passwood", hashed)
                        req.body.password = hashed
                    });
            }
            User.create(req.body).then((data) => {
                return res.status(201).send(data)
            }).catch((err) => {
                console.log(err);
                return res.status(500).send(`error ${err}`)
            })
        })
    }catch(e){
        return res.status(403).send('user data is not Added sucessful',e)
    }
})

Router.post('/login', async (req, res) => { 
    console.log(req.body)
    const {email} =req.body; 
    try{
        await User.findOne({ email: email }).then((user) => {
            if(user){
                const id = user._id
                if (user.password === req.body.password) {
                    jwt.sign({ id }, secrate_key, { expiresIn: "24h" }, (err, token) => {
                        res.json({ token })
                    })
                } else {
                    return res.send("password is incorrect")
                }
            }else{
                return res.send("User Not Found")   
            }
        }).catch(() => {
            return res.send("user not found");
        })
    }catch{
        return res.status(403).send('User Not LogIn sucessfully',e)
    }
})

module.exports = Router
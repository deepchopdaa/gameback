const express = require("express");
const Router = express.Router();
const User = require("../models/User.js")
const jwt = require("jsonwebtoken")
const secrate_key = "secratekey"
const bcrypt = require('bcrypt');

Router.post("/register", async (req, res) => {
    console.log(req.body)
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
            res.status(201).send(data)
        }).catch((err) => { 
            console.log(err);
            res.status(500).send(`error ${err}`)
        })
    })  
})

Router.post('/login', async (req, res) => {
    console.log(req.body)
    User.findOne({ email: req.body.email }).then((user) => {
        console.log(user)
        const id = user._id
        if (user.password === req.body.password) {
            jwt.sign({ id }, secrate_key, { expiresIn: '1200s' }, (err, token) => {
                res.json({ token })
            })
        } else {
            res.send("password is incorrect")
        }      
    }).catch(() => {
        res.send("user not found");
    })
})


module.exports = Router
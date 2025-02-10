const express = require("express");
const Router = express.Router();
const Admin = require("../models/Admin.js");
const bcrypt = require('bcrypt');
Router.get("/getAdmin", async (req, res) => {
    let data = await Admin.find();
    res.send(data);
    console.log(data);
})

Router.post("/addAdmin", async (req, res) => {
    console.log(req.body)
    Admin.findOne({ email: req.body.email }).then((admin) => {
        if (admin) {
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
        Admin.create(req.body).then((data) => {
            res.status(201).send(data)
        }).catch((err) => {
            console.log(err);
            res.status(500).send(`error ${err}`)
        })
    })
})

Router.put("/updateadmin/:id", async (req, res) => {
    let id = req.params.id;
    let { name, email, password } = req.body;
    if (name && email && password) {
        let data = await Admin.findByIdAndUpdate(id, { name, email, password }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

module.exports = Router
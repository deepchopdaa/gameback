const express = require("express");
const Router = express.Router();
const Admin = require("../models/Admin.js");
const jwt = require("jsonwebtoken")
const secrate_key = "secratekey"
const bcrypt = require('bcrypt');
Router.get("/getAdmin", async (req, res) => {
    try {
        let data = await Admin.find();
        res.status(200).send(data);
        console.log(data);
    } catch (e) {
        res.status(403).send('admin data is not getted sucessful', e)
    }
})

Router.post("/addAdmin", async (req, res) => {
    console.log(req.body)
    try {

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
                return res.status(201).send(data)
            }).catch((err) => {
                console.log(err);
                res.status(500).send(`error ${err}`)
            })
        })
    } catch (e) {
        res.status(403).send('admin is not Added sucessful', e)
    }
})

Router.put("/updateadmin/:id", async (req, res) => {
    let id = req.params.id;
    try {

        let { name, email, password } = req.body;
        if (name && email && password) {
            let data = await Admin.findByIdAndUpdate(id, { name, email, password }, { new: true });
            console.log(data);
            res.send(data)
        } else {
            res.send("enter all required feild")
            console.log("enter all required feild")
        }
    } catch (e) {
        res.status(403).send('admin data is not Updated sucessful', e)
    }
})

Router.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        Admin.findOne({ email : req.body.email}).then((admin) => {
            console.log(admin, "admin")
            const id = admin._id
            if (admin.password === req.body.password) {
                jwt.sign({ id }, secrate_key, { expiresIn: '60min' }, (err, token) => {
                    console.log(token)  
                    res.json({ token })     
                })
            } else {
                res.send("password is incorrect")
            }   
        }).catch(() => {
            res.send("user not found");
        })
    } catch (e) {
        res.send('User Not LogIn sucessfully')
    }
})

module.exports = Router
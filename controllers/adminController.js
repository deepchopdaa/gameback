const express = require("express");
const Router = express.Router();
const Admin = require("../models/Admin.js");

const Category = require("../models/Category.js");
const Contact = require("../models/Contact.js");
const Game = require("../models/Game.js");
const Review = require("../models/Review.js");
const Ticket = require("../models/Ticket.js");
const User = require("../models//User.js");
const jwt = require("jsonwebtoken")
const secrate_key = "secratekey"
const bcrypt = require('bcrypt');

Router.get("/getAdmin", async (req, res) => {
    try {
        let data = await Admin.find();
        console.log(data);
        return res.status(200).send(data);
    } catch (e) {
        return res.status(403).send('admin data is not getted sucessful', e)
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
                return res.status(500).send(`error ${err}`)
            })
        })
    } catch (e) {
        return res.status(403).send('admin is not Added sucessful', e)
    }
})

Router.put("/updateadmin/:id", async (req, res) => {
    let id = req.params.id;
    try {

        let { name, email, password } = req.body;
        if (name && email && password) {
            let data = await Admin.findByIdAndUpdate(id, { name, email, password }, { new: true });
            console.log(data);
            return res.send(data)
        } else {
            res.send("enter all required feild")
            console.log("enter all required feild")
        }
    } catch (e) {
        return res.status(403).send('admin data is not Updated sucessful', e)
    }
})

Router.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        Admin.findOne({ email: req.body.email }).then((admin) => {
            console.log(admin, "admin")
            const id = admin._id
            if (admin.password === req.body.password) {
                jwt.sign({ id }, secrate_key, { expiresIn: '24h' }, (err, token) => {
                    console.log(token)
                    return res.json({ token })
                })
            } else {
                return res.send("password is incorrect")
            }
        }).catch(() => {
            return res.send("user not found");
        })
    } catch (e) {
        return res.send('User Not LogIn sucessfully')
    }
})

Router.get("/getCount", async (req, res) => {
    try {
        const category = await Category.countDocuments({});
        const contact = await Contact.countDocuments({});
        const game = await Game.countDocuments({});
        const review = await Review.countDocuments({});
        const ticket = await Ticket.countDocuments({});
        const user = await User.countDocuments({});
        console.log(category, contact, game, review, ticket, user);
        return res.json({ category, contact, game, review, ticket, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = Router



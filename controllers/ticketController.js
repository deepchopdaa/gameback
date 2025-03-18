const express = require("express");
const Router = express.Router();
const Ticket = require("../models/Ticket.js");
const game = require("../models/Game.js")
const authVerify = require('../middleware/authMiddleware.js')
const Nodemailer = require("nodemailer");
const userVerify = require("../middleware/UserMiddleware.js");
Router.get("/getticket", authVerify, async (req, res) => {
    try{
        let data = await Ticket.find().sort({date:-1});
        res.send(data);
        console.log(data);
    }catch(e){
        console.log("Getting Ticket Error" ,e)
    }
    
})


/* for Add To Cart Menu Record Insert */
Router.post("/addticket", userVerify, async (req, res) => {
    try {
        const user = req.user;
        const name = user.name
        const email = user.email
        let username = name
        console.log(username)
        console.log(email)
        console.log(req.body)
        const { user_id, Game_id, amount, SeatNumber, date, time_slot } = req.body;
        if (!user_id || !Game_id || !amount || !SeatNumber || !date || !time_slot) {
            return res.status(400).json({ error: "All fields are required" });
        }
        let data = await Ticket.create({ user_id, Game_id, SeatNumber, amount, date, time_slot });
        console.log("New Ticket Created:", data);
        let gamerecord = await game.findById(Game_id);
        console.log(gamerecord);
        console.log(gamerecord.title)
        const transporter = Nodemailer.createTransport({
            host: "smtp.ethereal.email",
            service: 'gmail',
            port: 465,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: 'deepchopda01@gmail.com',
                pass: 'zhjh waof srgk nqxa'
            },
        });
        async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: '"Deep Chopda" <deepchopda01@gmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: "Ticket System", // Subject line
                text: "Booking Game", // plain text body
                html: `<div><h2>Name  = ${username}</h2></br><h2>Game  = ${gamerecord.title}</h2></br><h2>Amount  = ${amount}</h2></br><h2>Date  = ${date}</h2></br><h2>Ticket  = ${SeatNumber}</h2></br><h2>Time Slot  = ${time_slot}</h2></br></div>`
            });
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }
        main().catch(console.error);
        return res.status(201).json(data);
    } catch (error) {
        console.error("Error creating ticket:", error);
        return res.status(500).json({ error: "Server error" });
    }
});


Router.put("/updateticket/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let { user_id, Game_id, amount, SeatNumber } = req.body;
    if (user_id && Game_id && amount && SeatNumber) {
        let data = await Ticket.findByIdAndUpdate(id, { user_id, Game_id, SeatNumber, amount }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

Router.delete("/deleteticket/:id", authVerify, async (req, res) => {
    let id = req.params.id;
    let data = await Ticket.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})

module.exports = Router
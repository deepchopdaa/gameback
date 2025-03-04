const express = require("express");
const Router = express.Router();
const Nodemailer = require("nodemailer");
const Contact = require("../models/Contact.js");

// Middleware for authentication (if required)
const authVerify = require('../middleware/authMiddleware.js');

Router.get("/getcontact",authVerify, async (req, res) => {
    try {
        const data = await Contact.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

Router.post("/addcontact",authVerify, async (req, res) => {
    try {
        const { name, number, email, description } = req.body;
        if (!name || !number || !email || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newContact = await Contact.create({ name, number, email, description });
        console.log("New Contact Added:", newContact);
        res.status(201).json(newContact);
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
                subject: "Contect", // Subject line
                text: "Request Submit", // plain text body
                html: `<h2>Your Contect form submited successfully</h2>`, // html body
            });
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }
        main().catch(console.error);
    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


Router.put("/updatecontact/:id",authVerify, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, number, email, description } = req.body;
        if (!name || !number || !email || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingContact = await Contact.findById(id);
        if (!existingContact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { name, number, email, description },
            { new: true }
        );
        console.log("Contact Updated:", updatedContact);
        res.status(200).json(updatedContact);
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

Router.delete("/deletecontact/:id",authVerify, async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        await Contact.findByIdAndDelete(id);
        console.log("Contact Deleted:", contact);
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = Router;

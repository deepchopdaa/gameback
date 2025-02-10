const express = require("express");
const Nodemailer = require("nodemailer");
const Router = express.Router();

Router.get('/mail', async (req, res) => {
    const transporter = Nodemailer.createTransport({
        host: "smtp.ethereal.email",
        service:'gmail',
        port: 465,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: 'deepchopda01@gmail.com',
            pass: 'zhjh waof srgk nqxa' 
        },
    });
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Deep Chopda" <deepchopda01@gmail.com>', // sender address
            to: "dchopda64@gmail.com", // list of receivers
            subject: "OTP", // Subject line
            text: "Hello world?", // plain text body
            html: `<h2>Your verification code ${verificationCode} </h2>`, // html body
        });
        console.log(`Verification code ${verificationCode}`)
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
    main().catch(console.error);
});

module.exports = Router     
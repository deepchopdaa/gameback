const user = require("../models/User.js");
const jwt = require("jsonwebtoken")
const secrate_key = "secratekey"
const verifytoken = async (req, res, next) => {
    const bearerHeader = req.headers.authorization
    console.log(req.headers, "req.headersreq.headers")
    console.log(bearerHeader, "bearerHeaderbearerHeader")
    console.log(bearerHeader, "bearer header")
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        console.log(bearer)
        const token = bearer[1];
        console.log(token);
        jwt.verify(token, secrate_key, (err, authData) => {
            if (err) {
                res.send({ result: "Unauthorize user" })
            } else {
                req.user = authData
                console.log(req.user)
                user.findOne({ id: req.user }).then(()=>{
                    return next()
                }).catch(()=>{
                    res.send("User not Found")
                })
            }
        })
    } else {
        res.send({
            result: "token is unvalid"
        })
    };
}

module.exports = verifytoken
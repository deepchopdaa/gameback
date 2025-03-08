const user = require("../models/User.js");
const jwt = require("jsonwebtoken")
const secrate_key = "secratekey"
const userVerify = async (req, res, next) => {
    const bearerHeader = req.headers.authorization
    console.log(req.headers, "req.headersreq.headers")
    console.log(bearerHeader, "bearerHeaderbearerHeader")
    console.log(bearerHeader, "bearer header")
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        console.log(bearer)
        const token = bearer[1];
        console.log(token);
        const verify = jwt.verify(token, secrate_key)
        if (verify) {
            console.log(verify , "<------verify-------->")
            user.findOne({ _id: verify.id }).then((user1) => {
                if (user1) {
                    console.log(user1, "<------------------user data ----------------->")
                    return next();
                }else{
                    console.log("user Not Found")
                }
            }).catch((e) => {
                console.log("User Not Found", e)
            })
        } else {
            console.log("data not found")
        }
    } else {
        res.send({
            result: "token is unvalid"
        })
    };
}

module.exports = userVerify
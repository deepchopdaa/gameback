require('dotenv').config();
const { verify } = require('jsonwebtoken');
const userModel = require("../models/User.js");
const { mongoose } = require('mongoose');

const userVerify = async (req, res, next) => {
    try {
        const Authorization = (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

        if (Authorization) {

            const secretKey = process.env.SECRET_KEY;
            const verificationResponse = await verify(Authorization, secretKey);

            if (!verificationResponse) {
                next({status :401, message :'Wrong authentication token'});
            }
            const userId = verificationResponse.id;
            const findUser = await userModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });
           
            if (findUser) {
                console.log(findUser)
                req.user = findUser;
                next();
            } else {
                next({status :401, message :'Wrong authentication token'});
            }
        } else {
            next({status :404, message :'Token Expiry or Login First...... '})
        }
    } catch (error) {
        next(error);
    }
};

module.exports = userVerify;







// const user = require("../models/User.js");
// const jwt = require("jsonwebtoken")
// const secrate_key = "secratekey"
// const userVerify = async (req, res, next) => {
//     const bearerHeader = req.headers.authorization
//     console.log(req.headers, "req.headersreq.headers")
//     console.log(bearerHeader, "bearerHeaderbearerHeader")
//     console.log(bearerHeader, "bearer header")
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(" ");
//         console.log(bearer)
//         const token = bearer[1];
//         console.log(token);
//         const verify = jwt.verify(token, secrate_key)
//         if (verify) {
//             console.log(verify , "<------verify-------->")
//             user.findOne({ _id: verify.id }).then((user1) => {
//                 if (user1) {
//                     console.log(user1, "<------------------user data ----------------->")
//                     return next();
//                 }else{
//                     console.log("user Not Found")
//                 }
//             }).catch((e) => {
//                 console.log("User Not Found", e)
//             })
//         } else {
//             console.log("data not found")
//         }
//     } else {
//         res.send({
//             result: "token is unvalid"
//         })
//     };
// }

// module.exports = userVerify
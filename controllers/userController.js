const express = require("express");
const Router = express.Router();
const User = require("../models/User.js");
const authVerify = require('../middleware/authMiddleware.js');
const userVerify = require("../middleware/UserMiddleware.js");

Router.get("/getuser", authVerify, async (req, res) => {
    try {
        let data = await User.find().sort({ _id: -1 });
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send('Cant Get User')
    }
})

Router.get("/getuserReview", async (req, res) => {
    try {
        let data = await User.find();
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send("Can't Get User Review")
    }
})

/* smaple code */

/* Router.get("/getuser", authVerify, async (req, res) => {
    try {
        const userData = await User.find()
        if (userData.length > 0) {
            return res.json({
                status: 400,
                user: userData
            })
        } else {
            return res.json({
                status: 400,
                message: 'user data not available'
            })
        }
    } catch (error) {
        console.log(error, "get user error")
        return res.json({
            status: 500,
            messaage: "internal server error "
        })
    }
}) */


/* Router.put("/updateuser/:id", authVerify, async (req, res) => {
    let id = req.params.id
    let { name, email, password } = req.body;
    if (name && email && password) {
        let data = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        console.log(data)
        res.send(data)
    } else {
        res.send("enter all required feild");
        console.log("enter all required feild");
    }
})
 */
Router.put('/updatestatus/:id', authVerify, async (req, res) => {
    try {
        const userId = req.params.id;
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Toggle status (assuming it's "active" or "inactive")
        user.status = user.status === 'active' ? 'inactive' : 'active';
        // Save the updated user
        await user.save();
        return res.json({ message: 'Status updated successfully', status: user.status });   
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

Router.delete("/deleteuser/:id", authVerify, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await User.findByIdAndDelete(id);
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(400).send("Cant Delete User !")
    }
})


/* for user Penel */

Router.get("/getuserdetails", userVerify, async (req, res) => {
    try {
        console.log("api calling")
        const user = req.user;
        if (!user) {
            return res.status(200).send("User Not Found");
        } else {
            console.log(user);
        }
        // console.log(data);
        return res.send(user);
    } catch (e) {
        return res.status(500).send('Internal server Error')
    }
})

Router.put("/updateuser", userVerify, async (req, res) => {
    try {
        console.log("Update User Api call")
        const  user  = req.body;
        console.log(user, "Update User Body")
        const user1 = req.user
        console.log(user1 , "req .user")
        const userId = user1._id
        let data = await User.findByIdAndUpdate(userId, user, { new: true });
        console.log(data);
        return res.send(data);
    } catch (e) {
        return res.status(500).send("Internal server Error")
    }
})

module.exports = Router
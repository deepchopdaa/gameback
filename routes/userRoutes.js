const express = require("express");
const Router = express.Router();

const { UserGet,UserUpdate,UserDelete } = require("../controllers/categoryController.js");
Router.get('/getuser', UserGet)

Router.put('/updateuser/:id', UserUpdate)
Router.delete('/deleteuser/:id', UserDelete)

module.exports = Router
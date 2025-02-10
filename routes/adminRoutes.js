const express = require("express");
const Router = express.Router();
const { AdminGet,
    AdminUpdate, } = require("../controllers/categoryController.js");
Router.get('/getadmin', AdminGet)
Router.put('/updateadmin/:id', AdminUpdate)

module.exports = Router
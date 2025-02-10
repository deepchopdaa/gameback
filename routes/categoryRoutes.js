const express = require("express");
const Router = express.Router();
const { Categoryget, Categoryadd, CategoryUpdate, CategoryDelete } = require("../controllers/categoryController.js");
Router.get('/getcategory', Categoryget)
Router.post('/addcategory', Categoryadd)
Router.put('/updatecategory/:id', CategoryUpdate)
Router.delete('/deletecategory/:id', CategoryDelete)

module.exports = Router
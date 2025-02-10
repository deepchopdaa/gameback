const express = require("express");
const Router = express.Router();

const { ReviewGet,
    ReviewAdd,
    ReviewUpdate,
    ReviewDelete } = require("../controllers/reviewController.js");
Router.get('/getreview', ReviewGet)
Router.post('/addreview', ReviewAdd)
Router.put('/updatereview/:id', ReviewUpdate)
Router.delete('/deletereview/:id', ReviewDelete)

module.exports = Router
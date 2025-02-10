const express = require("express");
const Router = express.Router();
const { GameGet,GameAdd, GameUpdate, GameDelete } = require("../controllers/gameController.js");
Router.get('/getGame', GameGet)
Router.post('/addGame', GameAdd)
Router.put('/updateGame/:id', GameUpdate)
Router.delete('/deleteGame/:id', GameDelete)

module.exports = Router
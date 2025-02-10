const express = require("express");
const Router = express.Router();
const { TicketGet,TicketAdd,TicketUpdate,TicketDelete } = require("../controllers/ticketController.js");
Router.get('/getticket', TicketGet)
Router.post('/addticket', TicketAdd)
Router.put('/updateticket/:id', TicketUpdate)
Router.delete('/deleteticket/:id', TicketDelete)

module.exports = Router
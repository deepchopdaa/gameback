const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Game_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    price:{
        type:Number,
        require:true
    }
})

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;    
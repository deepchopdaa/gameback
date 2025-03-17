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
    amount:{
        type:Number,
        require:true
    },
    SeatNumber:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        require:true
    },
    time_slot:{
        type:String,
        require:true
    }
},{ timestamps: true })

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;    
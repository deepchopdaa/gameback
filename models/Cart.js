const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Game_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    ticket:{
        type:Number,
        require:true
    },
    time_slot:{
        type:String,
        require:true  
    },
    t_price:{
        type:Number,
        require:true
    },  
    amount:{
        type:Number,
        require:true
    }
})

const Ticket = mongoose.model('cart', cartSchema);
module.exports = Ticket;    
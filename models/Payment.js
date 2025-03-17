const { Transaction } = require("mongodb");
const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    ammount:{
        type:Number,
        require:true
    },
    paymentStatus:{
        type:String,
        require:true
    },
    transaction_id:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
},{ timestamps: true })

const payment = mongoose.model('payment',paymentSchema);
module.exports = payment;
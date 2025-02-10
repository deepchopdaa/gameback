const mongoose = require("mongoose");


const GameSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    descrption:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    rating:{
        type:Number,
        require:true
    }
})
const Game = mongoose.model('Game',GameSchema);
module.exports = Game;
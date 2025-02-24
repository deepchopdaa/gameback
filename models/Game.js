const mongoose = require("mongoose");


const GameSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    descrption: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    }
})
const Game = mongoose.model('Game', GameSchema);
module.exports = Game;


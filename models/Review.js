const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Game_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Game'
    },
    rating:{
        type:Number,
        require:true
    },
    comment:{
        type:String,
        require:true
    },
    date:{
        type:Date,  
        default:Date.now    
    }
},{ timestamps: true })

const Review = mongoose.model('Review',ReviewSchema);
module.exports = Review;
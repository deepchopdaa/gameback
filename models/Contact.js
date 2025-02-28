const mongoose = require("mongoose");

const ContactSchema =  mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    number:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    }
})

const Contact = mongoose.model('Contact',ContactSchema);
module.exports = Contact;
const mongoose = require("mongoose");
const AdminSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
},{ timestamps: true, versionKey: false })
const Admin = mongoose.model('Admin',AdminSchema);
module.exports = Admin;
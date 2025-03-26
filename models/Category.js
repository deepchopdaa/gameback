const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
},{ timestamps: true, versionKey: false })

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
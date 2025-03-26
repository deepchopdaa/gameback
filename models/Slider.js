const mongoose = require('mongoose')

const SliderSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    }
}, { timestamps: true, versionKey: false })

const Slider = mongoose.model("slider", SliderSchema);

module.exports = Slider
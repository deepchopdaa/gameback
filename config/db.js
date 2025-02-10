const mongoose = require("mongoose");
const main = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/game");
    } catch(e){
        console.log("connection error",e)
    }
}
main();
const mongoose = require("mongoose");
const main = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/game");
        console.log("MongoDb Connected !")
    } catch (e) {
        console.log("connection error", e)
    }
}
main();
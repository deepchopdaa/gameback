const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config()

const main = async () => {
    try {
        await mongoose.connect(process.env.MonogoURI);
        console.log("MongoDb Connected !")
    } catch (e) {
        console.log("connection error", e)
    }
}
main();
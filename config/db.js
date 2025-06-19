const mongoose = require("mongoose");
const main = async () => {
    try {
        await mongoose.connect("mongodb+srv://deepchopda01:laI99UV9ePw6Ran2@cluster0.ihb1e2w.mongodb.net/");
        console.log("Mongodb connection sucess")
    } catch (e) {
        console.log("connection error", e)
    }
}
main();
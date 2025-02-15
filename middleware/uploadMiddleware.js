const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, res, cb) => {    
        cb(null, './upload');
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Math.floor(100 + Math.random() * 100) + file.originalname)
    }
})

const upload= multer({storage})
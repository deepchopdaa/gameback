/* 
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'media', // Your Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'gif', 'url'], // allowed file types
    }
});

const upload = multer({ storage });

module.exports = upload;
 */

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../controllers/Cloudinary.js');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Extract the file type
        const isVideo = file.mimetype.startsWith("video");
        return {
            folder: 'media',
            resource_type: isVideo ? 'video' : 'image',
            format: file.originalname.split('.').pop(),
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

const upload = multer({ storage });

module.exports = upload;

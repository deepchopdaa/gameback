const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
    cloud_name: 'dwoqb0fua',
    api_key: '527851556669824',
    api_secret: '6EpbaqiozjqeZ-JoZjZdDXuyPlA' // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
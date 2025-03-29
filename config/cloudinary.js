const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name:"dwoqb0fua", // Your Cloudinary cloud name
  api_key: "527851556669824",
  api_secret: "6EpbaqiozjqeZ-JoZjZdDXuyPlA"
});

module.exports = cloudinary;
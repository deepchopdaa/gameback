import { v2 as cloudinary } from 'cloudinary';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dwoqb0fua', 
        api_key: '527851556669824', 
        api_secret: '6EpbaqiozjqeZ-JoZjZdDXuyPlA' // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    console.log(uploadResult);
    console.log(autoCropUrl);    
})();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


cloudinary.uploader
.upload("sample.jpg",
  { width: 2000, height: 1000, crop: "limit" })
.then(result=>console.log(result));

export default cloudinary;

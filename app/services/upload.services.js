const multer = require("multer"); // upload
const DatauriParser = require('datauri/parser');
const cloudinary = require('cloudinary').v2;
require("dotenv").config();

// multer setting
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"]

// upload anh
// user memoryStore for multer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: function(req, file, cb){
        if(ALLOWED_FORMATS.includes(file.mimetype)){
            cb(null, true)
        }else{
            cb(new Error("not supported file type"), false);
        }
    }
});

const singleUpload = upload.single("file");

// use datauri to stream buffer
const parser = new DatauriParser();
const path = require('path')

const formatBuffer = (file) => {
    return parser.format(path.extname(file.originalname).toString().toLowerCase(), 
    file.buffer);
}
// setting cloundinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

cloudinaryUpload = (file) => 
    cloudinary.uploader.upload(file, {
        upload_preset: process.env.UPLOAD_PRESET
    })

module.exports = {
        singleUpload,
        formatBuffer,
        cloudinaryUpload,
      };
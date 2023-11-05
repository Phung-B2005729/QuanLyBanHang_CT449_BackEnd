const express = require("express"); // khai su dung modul express
const cors = require("cors");
//upload
const multer = require("multer"); // upload
const DatauriParser = require('datauri/parser');
const cloudinary = require('cloudinary').v2;
require("dotenv").config();


//
const session = require("express-session");
const app = express();
const KhachHangRouter = require("./app/routes/khachhang.route");
const AdminRouter = require("./app/routes/admin.route");

//
const HangHoaRouter= require("./app/routes/hanghoa.route");
const LoaiHangRouter = require("./app/routes/loaihang.route");
const HinhAnhRouter= require("./app/routes/hinhanh.route");

//
app.use(cors());
app.use(express.json()); 
const ApiError = require("./app/api-error");
// su dung session
app.use(session({
    secret: "mysession", // Chuỗi bí mật để mã hóa phiên
    resave: false,
    saveUninitialized: true
}));

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
const singleUploadCtrl = (req, res, next) => {
    singleUpload(req, res, (error)=> {
        if(error){
            return next(new ApiError(404, "Image upload failed"));
        }
        next();
    })
}
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


// upload API
app.post("/api/upload/", singleUploadCtrl, async (req, res, next) => {
    try{
      if(!req.file){
        return next(new ApiError(404, "There is error when uplaoding"));
      }

      const file64 = formatBuffer(req.file);
      const uploadResult = await cloudinaryUpload(file64.content);
      return res.send({
        cloudinaryId: uploadResult.public_id,
        url: uploadResult.secure_url,
        message: "Upload Ok!",
      })
    }catch(error){
        return next(new ApiError(404, error.message));
    }
   /* console.log(req.file);
    return res.send({
        message: "Image sent",
    }); */

})
// khac hang
app.use("/api/khachhang", KhachHangRouter);
// admin
app.use("/api/admin", AdminRouter);

// hang hoa
app.use("/api/hoanghoa", HangHoaRouter);
app.use("/api/loaihang", LoaiHangRouter);
app.use("/api/hinhanh", HinhAnhRouter);

// khawcs loi truy cap dg link khac
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

//
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;





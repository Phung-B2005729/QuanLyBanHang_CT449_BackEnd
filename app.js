const express = require("express"); // khai su dung modul express
const cors = require("cors");
//upload



//
const session = require("express-session");
const app = express();
const KhachHangRouter = require("./app/routes/khachhang.route");
const AdminRouter = require("./app/routes/admin.route");

//
const HangHoaRouter= require("./app/routes/hanghoa.route");
const LoaiHangRouter = require("./app/routes/loaihang.route");
const HinhAnhRouter= require("./app/routes/hinhanh.route");
const GioHangRouter= require("./app/routes/giohang.route");
const ChiTietDatHangRouter = require("./app/routes/chitietdathang.route");
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



// upload anh
// user memoryStore for multer



// use datauri to stream buffer

// setting cloundinary



// upload API

// khac hang
app.use("/api/khachhang", KhachHangRouter);
// admin
app.use("/api/admin", AdminRouter);

// hang hoa
app.use("/api/hanghoa", HangHoaRouter);
app.use("/api/loaihang", LoaiHangRouter);
app.use("/api/hinhanh", HinhAnhRouter);
app.use("/api/giohang", GioHangRouter);
app.use("/api/chitietdathang", ChiTietDatHangRouter);
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





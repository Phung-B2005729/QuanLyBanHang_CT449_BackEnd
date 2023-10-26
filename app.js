const express = require("express"); // khai su dung modul express
const cors = require("cors");
const session = require("express-session");
const app = express();
const KhachHangRouter = require("./app/routes/khachhang.route");
const AdminRouter = require("./app/routes/admin.route");
app.use(cors());
app.use(express.json()); 

const ApiError = require("./app/api-error");
app.use(session({
    secret: "mysession", // Chuỗi bí mật để mã hóa phiên
    resave: false,
    saveUninitialized: true
}));

app.use("/api/khachhang", KhachHangRouter);
app.use("/api/admin", AdminRouter);

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





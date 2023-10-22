const express = require("express"); // khai su dung modul express
const cors = require("cors");
const session = require("express-session");
const app = express();
const KhachHangRouter = require("./app/routes/khachhang.route");
const NhanVienRouter = require("./app/routes/nhanvien.route");
app.use(cors());
app.use(express.json()); 

const ApiError = require("./app/api-error");
app.use(session({
    secret: "mysession", // Chuỗi bí mật để mã hóa phiên
    resave: false,
    saveUninitialized: true
}));

app.use("/api/khachhang", KhachHangRouter);
app.use("/api/admin", NhanVienRouter);

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



//var bodyParser = require('body-parser');  // lay du lieu gui dnag form post
//app.use(bodyParser.urlencoded({extended: false}))
//app.use(bodyParser.json());
//
/*app.get("/login", (req,res) => {
      res.send("Nhập vào thông tin đăng nhập");
});

app.post("/login", (req, res) => {
    req.session.user = { id: 1, username: "exampleuser" }; // Lưu thông tin đăng nhập vào phiên
    res.send("Đăng nhập thành công");
    
});
app.get("/", (req, res) => {
    res.send("Trang chủ");
});
app.get("/cart", (req, res) => {
    if (req.session.user) {
        // Người dùng đã đăng nhập
        res.send(`Xin chào, ${req.session.user.username}`);
    } else {
        // Người dùng chưa đăng nhập
        res.send("Vui lòng đăng nhập để truy cập trang này");
    }
});
app.get("/logout", (req, res) => {
    delete req.session.user;
    // Chuyển hướng đến trang đăng nhập sau khi xoá biến user
}); 
*/



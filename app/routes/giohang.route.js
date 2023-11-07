const express = require("express");
const giohang = require("../controllers/giohang.controller");

const router = express.Router();


router.route("/").post(giohang.create);


router.route("/:id").put(giohang.update).delete(giohang.delete);

router.route("/khachhang/:id").get(giohang.findALLByIdKhachHang).delete(giohang.deleteAllGioHangKhachHang);

module.exports = router;
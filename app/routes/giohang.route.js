const express = require("express");
const giohang = require("../controllers/giohang.controller");

const router = express.Router();


router.route("/").post(giohang.create);


router.route("/:id").put(giohang.update).delete(giohang.delete);

router.route("/khachhang/:idkhachhang").get(giohang.findALLByIdKhachHang).delete(giohang.deleteAllGioHangKhachHang);
router.route("/hanghoa/:idhanghoa").get(giohang.findALLByIdSanPham);
router.route("/:idkhachhang/:idhanghoa").get(giohang.findALLByIdKhachHangVaIdSanPham);




module.exports = router;
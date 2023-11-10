const express = require("express");
const dathang = require("../controllers/dathang.controller");

const router = express.Router();


router.route("/").get(dathang.findAll).post(dathang.create).delete(dathang.deleteAll);


router.route("/:id").get(dathang.findOne).put(dathang.update).delete(dathang.delete);

router.route("/khachhang/:idkhachhang").get(dathang.findAllIdKhacHang).delete(dathang.deleteByIdKhachHang);
router.route("/nhanvien/:idnhanvien").get(dathang.findAllIdNhanVien).delete(dathang.deleteByIdNhanVien);

module.exports = router;
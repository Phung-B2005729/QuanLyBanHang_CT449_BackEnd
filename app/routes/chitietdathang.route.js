const express = require("express");
const chitietdathang = require("../controllers/chitietdathang.controller");

const router = express.Router();


router.route("/").post(chitietdathang.create);


router.route("/dathang/:id").get(chitietdathang.findALLByiddathang).delete(chitietdathang.deleteAllChiTietDatHangIdDatHang);

module.exports = router;
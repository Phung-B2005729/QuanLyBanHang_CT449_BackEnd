const express = require("express");
const hanghoa = require("../controllers/hanghoa.controller");

const router = express.Router();


router.route("/").get(hanghoa.findAll).post(hanghoa.create).delete(hanghoa.deleteAll);


router.route("/:id").get(hanghoa.findOne).put(hanghoa.update).delete(hanghoa.delete);

router.route("/loaihang/:id").get(hanghoa.findAllByLoaiHang);
router.route("/search/:tenhh").get(hanghoa.searchByName);

module.exports = router;
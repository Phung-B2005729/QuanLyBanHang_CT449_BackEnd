const express =  require("express");
const khachhang = require("../controllers/khachhang.controller");


const router = express.Router();

router.route("/").get(khachhang.findAll).delete(nhanvien.deleteAll);
router.route("/register").post(khachhang.create);
router.route("/login").post(khachhang.login);
router.route("/logout").get(khachhang.logout);

router.router("/:id").get(khachhang.findOne).put(khachhang.update).delete(khachhang.delete);


module.exports = router;
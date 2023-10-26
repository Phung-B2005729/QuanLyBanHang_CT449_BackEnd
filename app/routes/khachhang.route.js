const express =  require("express");
const khachhang = require("../controllers/khachhang.controller");


const router = express.Router();
router.route("/").get(khachhang.findAll);
router.route("/register").post(khachhang.create);
router.route("/login").post(khachhang.login);
router.route("/logout").get(khachhang.logout);
module.exports = router;
const express =  require("express");
const nhanvien = require("../controllers/nhanvien.controller");


const router = express.Router();

router.route("/").get(nhanvien.findAll).delete(nhanvien.deleteAll);
router.route("/register").post(nhanvien.create);
router.route("/login").post(nhanvien.login);
router.route("/logout").get(nhanvien.logout);

router.route("/:id").get(nhanvien.findOne).put(nhanvien.update).delete(nhanvien.delete);


module.exports = router;
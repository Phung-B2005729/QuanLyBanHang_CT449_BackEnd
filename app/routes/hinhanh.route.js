const express = require("express");
const hinhanh = require("../controllers/hinhanh.controller");

const router = express.Router();

router.route("/").get(hinhanh.findALL).post(hinhanh.create);

router.route("/:id").get(hinhanh.findOne).put(hinhanh.update).delete(hinhanh.delete);

router.route("/idhanghoa/:id").get(hinhanh.findByIdHangHoa);

router.route("/upload").post(hinhanh.upload)

module.exports = router;
const express =  require("express");
const router = express.Router();
const ApiError = require("../api-error");
router.use((req, res, next) => {
    if (req.session.user) {
       next();
    } else {
        // Người dùng chưa đăng nhập
        return next(new ApiError(400, "Người dùng chưa đăng nhập"));
    }
});
router.get("/", (req, res) => {
   res.send("Xin chao admin");
});

module.exports = router;
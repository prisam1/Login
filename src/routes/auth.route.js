const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controller/userController");
const { authenticate } = require("../auth/auth");
const { asyncHandler, loginLimiter, registerLimiter } = require("../middleware");

router.post("/register", registerLimiter, asyncHandler(register));
router.post("/login", loginLimiter, asyncHandler(login));
router.get("/me", asyncHandler(authenticate), asyncHandler(me));

module.exports = router;

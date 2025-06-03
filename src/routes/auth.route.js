const express = require("express");
const router = express.Router(); 
const {
  register,
  login,
  Logout,
} = require("../controller/userController"); 
router.post("/Register", register);
router.post("/login", login);

 
module.exports = router;

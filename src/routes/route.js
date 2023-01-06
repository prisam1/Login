const express  = require("express")
const router =express.Router()
const {createitinarary,itinararyupdate,itinararyget}= require("../controller/itinararyController")
const {registeruser,loginUser} = require("../controller/userController")
const {authenticate} = require("../auth/auth")


router.post("/Register",registeruser)
router.post("/login",loginUser)
router.post("/CreateItinarary",authenticate,createitinarary)
router.put("/ItinararyUpdate/:id",authenticate,itinararyupdate)
router.get("/ItinararyGet/:id",authenticate,itinararyget)



router.all("/*",(req,res)=>{res.status(400).send({status:false,message:"Invalid path params"})})

module.exports = router
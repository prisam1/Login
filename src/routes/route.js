const express  = require("express")
const router =express.Router()
const {createitinarary,itinararyupdate,itinararyget}= require("../controller/itinararyController")
const {registeruser,loginUser,Logout} = require("../controller/userController")
const {authenticate,refreshToken} = require("../auth/auth")


router.post("/Register",registeruser)
router.post("/login",loginUser)
router.post("/CreateItinarary",authenticate,createitinarary)
router.put("/ItinararyUpdate/:id",authenticate,itinararyupdate)
router.get("/ItinararyGet/:id",authenticate,itinararyget)
router.get('/token', refreshToken)
router.delete('/logout', Logout)



router.all("/*",(req,res)=>{res.status(400).send({status:false,message:"Invalid path params"})})

module.exports = router 
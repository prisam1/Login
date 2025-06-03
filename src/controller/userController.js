const userModel = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const {checkInputsPresent,isValid,isValidName,isValidMobile,validateEmail,validPassword} =require("../valid/valid")

const register= async function(req,res)
{
  try{
       if(!checkInputsPresent(req.body))
           return res.status(400).send({status: false,message: "Enter details"})

          let {name,email,phone,password}=req.body     

        if(!isValid(name))
          return res.status(400).send({ status: false, message: "Name is required" })

        if(!isValidName(name))
          return res.status(400).send({ status: false, message: "Enter Valid Name" })

        if(!isValid(email))
          return res.status(400).send({ status: false, message: "Email is required" })

        if(!validateEmail(email))
          return res.status(400).send({ status: false, message: "Enter Valid Email" })
        
        if(!isValid(phone))
          return res.status(400).send({ status: false, message: "Phone Number is required" })

        if(!isValidMobile(phone))
          return res.status(400).send({ status: false, message: "Enter a Valid Phone Number" })  

        if(!isValid(password))
          return res.status(400).send({ status: false, message: "Password is required" })

        if(!validPassword(password))
          return res.status(400).send({ status: false, message: "Enter Valid Password" })

        req.body.password = await bcrypt.hash(req.body.password, 10)
    

       let userdata= await userModel.create(req.body)
          
       return res.status(201).send({status:true,Message:"Successful",data:userdata})    

  }

  catch(err)
  {
    console.log(err)
    return res.status(500).send({status: false, message: err.message})
  }


}

const login = async function (req, res) {
  try {
    let data = req.body
    if (!checkInputsPresent(data))
      return res.status(400).send({ status: false, msg: "Email and Password is required" })

    const { email, password } = data

    if (!email)
      return res.status(400).send({ status: false, msg: "User Email is required" })

    if (!password)
      return res.status(400).send({ status: false, msg: "User Password is required" })

    if (!validateEmail(email))
      return res.status(400).send({ status: false, msg: "Enter Valid Email Id" })

    let user = await userModel.findOne({ email })
    if (!user)
      return res.status(400).send({ status: false, msg: "User not Exist" })

    let actualPassword = await bcrypt.compare(password, user.password)

    if (!actualPassword)
      return res.status(400).send({ status: false, msg: "Incorrect password" })


    let token = jwt.sign({ userId: user._id, name:user.name }, "blank", {
      expiresIn: "2d",
    })
  
    return res.status(200).send({status: true, message: "User login successfully",
        data: { userId: user._id, name:user.name, token: token },
      })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}
 
module.exports={register,login}

 


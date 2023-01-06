
const itinarary= require("../model/itineraryModel")
const user= require("../model/userModel")
const {checkInputsPresent,isValidNumber,validateDate,isValid,isValidObjectId} =require("../valid/valid")
const moment = require('moment')


const createitinarary = async function(req,res)
{
try{ 
  if(!checkInputsPresent(req.body))
     return res.status(400).send({status: false,message: "Enter details to create your account"})

  let {userId,from,to,data,activities,accommodation,totalcost}=req.body  


  if(!isValidObjectId(userId))
     return res.status(400).send({ status: false, message: "Please provide valid UserId"})

  if(!isValid(from) && !isValidNumber(from))
     return res.status(400).send({ status: false, message: "Date is required and should be Number"})

  if(!isValid(to) && !isValidNumber(to))
     return res.status(400).send({ status: false, message: "Date is required and should be Number"})
 
  if(!validateDate(from))
     return res.status(400).send({ status: false, message: "Please provide valid date in format YYYY-MM-DD"})
  if(!validateDate(to))
     return res.status(400).send({ status: false, message: "Please provide valid date in format YYYY-MM-DD"})

  let date = moment(from)
  let date2= moment(to)
  if(!date.isValid() && !date.isValid(date2))
     return res.status(400).send({ status: false, message: "Please provide valid date"})
 
  if(!isValid(date))
     return res.status(400).send({ status: false, message: "Date is required"})
  if(!isValidNumber(date))
     return res.status(400).send({ status: false, message: "Date should be in Number"})
  if(!isValid(activities))
     return res.status(400).send({ status: false, message: "Activity is required"})

  if(!isValid(accommodation))
     return res.status(400).send({ status: false, message: "accommodation is required"})

  if(!isValid(totalcost))
     return res.status(400).send({ status: false, message: "Totalcost is required"})
  if(!isValidNumber(totalcost))
     return res.status(400).send({ status: false, message: "Totalcost Should be in Number"}) 


    
  let result=await itinarary.create(req.body)

  res.status(201).send({status:true,message:"Successfully Created",data:result})

}

catch(err)
{

}
}

const itinararyupdate = async function(req,res)
{
try{ 
           
  let id=req.params.id
      
  let {userId,from,to,data,activities,accommodation,totalcost}=req.body  

  
  if(!isValidObjectId(userId))
     return res.status(400).send({ status: false, message: "Please provide valid UserId"})

if (from || from === "")   
 { 
   if(!isValid(from))
     return res.status(400).send({ status: false, message: "Date should be Required"})
   
   if(!isValidNumber(from))
     return res.status(400).send({ status: false, message: "Date should be in Number"})
 }

 if (to || to === "")
 { 
   if(!isValid(to))
   return res.status(400).send({ status: false, message: "Date should be Required"})
   
   if(!isValidNumber(to))
     return res.status(400).send({ status: false, message: "Date should be in Number"})
 }
  if(!validateDate(from))
     return res.status(400).send({ status: false, message: "Please provide valid date in format YYYY-MM-DD"})
  if(!validateDate(to))
     return res.status(400).send({ status: false, message: "Please provide valid date in format YYYY-MM-DD"})

  let date = moment(from)
  let date2= moment(to)
  if(!date.isValid() && !date.isValid(date2))
     return res.status(400).send({ status: false, message: "Please provide valid date"})

if (date || date === "")
{  if(!isValid(date))
     return res.status(400).send({ status: false, message: "Date is required"})
   if(!isValidNumber(date))
     return res.status(400).send({ status: false, message: "Date should be in Number"})

}
if (to || to === "")     
 { if(!isValid(activities))
     return res.status(400).send({ status: false, message: "Activity is required"})
 }
if (accommodation || accommodation === "")
{ if(!isValid(accommodation))
     return res.status(400).send({ status: false, message: "Accomodati is required"})
}
if (totalcost || totalcost === "")
{  
   if(!isValid(totalcost))
     return res.status(400).send({ status: false, message: "Totalcost is required"})   
   if(!isValidNumber(totalcost))
     return res.status(400).send({ status: false, message: "Totalcost Should be in Number"})   


} 
  let update=await itinarary.findByIdAndUpdate({_id:id},{...req.body},{new:true})

  res.status(200).send({status:true,message:"Successfully Update",data:update})

}

catch(err)
{

   return res.status(500).send({ status: false, message: err.message })
}
}

const itinararyget= async function(req,res)
{
try{ 
           
  let id=req.params.id

  if(!isValidObjectId(id))
     return res.status(400).send({ status: false, message: "Please provide valid UserId"})

  let get=await itinarary.findById({_id:id})

  res.status(200).send({status:true,message:"done",data:get})

}

catch(err)
{

   return res.status(500).send({ status: false, message: err.message })
}
}


module.exports={createitinarary,itinararyupdate,itinararyget}
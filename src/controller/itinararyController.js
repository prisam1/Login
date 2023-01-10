
const itineraryModel= require("../model/itineraryModel")
const user= require("../model/userModel")
const {checkInputsPresent,isValidNumber,isValid,isValidObjectId} =require("../valid/valid")
const moment = require('moment')


const createitinarary = async function(req,res)
{
try{ 
  if(!checkInputsPresent(req.body))
     return res.status(400).send({status: false,message: "Enter details to create your account"})

  const {userId,from,to,date,activities,accommodation,totalcost}=req.body  


  if(!isValidObjectId(userId))
     return res.status(400).send({ status: false, message: "Please provide valid UserId"})

  let date1 = moment(from)
  let date2= moment(to)

  if(!isValid(date1))
     return res.status(400).send({ status: false, message: "Date is required"})
  if(!isValid(date2))
     return res.status(400).send({ status: false, message: "Date is required"})

 
  if(!isValid(date))
     return res.status(400).send({ status: false, message: "Date is required"})

  if(!isValid(activities))
     return res.status(400).send({ status: false, message: "Activity is required"})

  if(!isValid(accommodation))
     return res.status(400).send({ status: false, message: "accommodation is required"})
 
  if(!isValid(totalcost))
     return res.status(400).send({ status: false, message: "Totalcost is required"})

    
  let result=await itineraryModel.create(req.body)

  res.status(201).send({status:true,message:"Successfully Created",data:result})

}

catch(err)
{
   return res.status(500).send({ status: false, message: err.message })
}
}

const itinararyupdate = async function(req,res)
{
try{ 
           
  let id=req.params.id
      
  let {userId,from,to,date,activities,accommodation,totalcost}=req.body  

  
  if(!isValidObjectId(userId))
     return res.status(400).send({ status: false, message: "Please provide valid UserId"})

if (from || from === "")   
 { 
   if(!isValid(from))
     return res.status(400).send({ status: false, message: "Date should be Required"})
   
 }

 if (to || to === "")
 { 
   if(!isValid(to))
   return res.status(400).send({ status: false, message: "Date should be Required"})
   
}
 
  let date1 = moment(from)
  let date2= moment(to)
  if(!isValid(date1) && !date.isValid(date2))
     return res.status(400).send({ status: false, message: "Please provide valid date"})

if (date || date === "")
{  if(!isValid(date))
     return res.status(400).send({ status: false, message: "Date is required"})
 
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
 
} 
  let update=await itineraryModel.findByIdAndUpdate({_id:id},{...req.body},{new:true})

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

  let get=await itineraryModel.findById({_id:id})

  res.status(200).send({status:true,message:"done",data:get})

}

catch(err)
{

   return res.status(500).send({ status: false, message: err.message })
}
}


module.exports={createitinarary,itinararyupdate,itinararyget}
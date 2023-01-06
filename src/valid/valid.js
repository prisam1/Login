const mongoose = require('mongoose');


const checkInputsPresent = (value) => {
    return (Object.keys(value).length > 0);
}

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true
}
const isValidNumber = function (value) {
    if (typeof value !== "number") return false
    return true
}

const isValidName = function(name){
    return /^[a-zA-Z\s]{2,20}$/.test(name.trim())
    }

const validateDate = (datee) => {
    return /^[1-2][0-9]{3}([\-])[0-9]{2}([\-])[0-9]{2}$/.test(date.trim())    

}
const validateEmail = (email) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()));
}

const isValidMobile = (phone) => {
    return /^[6-9]\d{9}$/.test(phone)
} 

const validPassword=(password)=>{
return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,15}$/.test(password))
}
const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId) 
}

module.exports={checkInputsPresent,isValid,isValidNumber,isValidName,validateEmail,validateDate,isValidMobile,validPassword,isValidObjectId}
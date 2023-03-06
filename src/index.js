require("dotenv").config() 
const express = require('express')
const route = require('./routes/route')
const  mongoose  = require("mongoose")
// const cookieParser = require("cookie-parser")
const cors = require("cors")
// app.use(cookieParser())
const app = express()

app.use(cors())
app.use(express.json())

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_STRING,
    {
        useNewUrlParser: true  
    })
    .then(() => { console.log("MongoDb is connected..."); })
    .catch(err => console.log(err))

 app.use('/', route)
 app.listen(process.env.PORT, function (){console.log("Application is connected to the Port")})



 
 
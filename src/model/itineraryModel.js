const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const ItinerarySchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
        required:true
    },
    name:{type: String}, 
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },        
    location:{type:String},

    duration:{type:String},
    
    hotelName:{ type: String},
    totalcost: { 
        type: Number
    },
    public: {
        type: Boolean,
        default: false
    }
},{ timestamps: true })

module.exports = mongoose.model("Itinerary", ItinerarySchema)
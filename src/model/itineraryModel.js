const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const ItinerarySchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
        required:true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    activities: [{
        name: String,
        location: String,
        duration: Number
    }],
    accommodation: [{
        from: {
            type: String
        },
        to: {
            type: String
        },
        hotelName: String,
        location: String
    }],
    totalcost: { 
        type: Number,
    },
    public: {
        type: Boolean,
        default: false
    }
},{ timestamps: true })

module.exports = mongoose.model("Itinerary", ItinerarySchema)
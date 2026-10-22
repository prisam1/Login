const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ItinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, trim: true, maxlength: 60 },
    from: { type: String, required: true, trim: true, maxlength: 60 },
    to: { type: String, required: true, trim: true, maxlength: 60 },
    date: { type: String, required: true, trim: true },
    location: { type: String, trim: true, maxlength: 80 },
    duration: { type: String, trim: true, maxlength: 30 },
    hotelName: { type: String, trim: true, maxlength: 80 },
    totalcost: { type: Number, min: 0 },
    public: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

ItinerarySchema.index({ userId: 1, date: 1 });
ItinerarySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Itinerary", ItinerarySchema);

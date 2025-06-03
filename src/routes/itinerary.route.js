const express = require("express");
const router = express.Router();
const {createItinerary, itineraryUpdate, itineraryGet } = require("../controller/itineraryController");
 
const { authenticate, refreshToken } = require("../auth/auth");

 
router.post("/", authenticate, createItinerary);
router.put("/", authenticate, itineraryUpdate);
router.get("/", authenticate, itineraryGet);

 

module.exports = router;

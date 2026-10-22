const express = require("express");
const router = express.Router();
const {
  createItinerary,
  itineraryGet,
  itineraryGetOne,
  itineraryUpdate,
  itineraryUpdateLegacy,
  itineraryDelete,
} = require("../controller/itineraryController");
const { authenticate } = require("../auth/auth");
const { asyncHandler, writeLimiter } = require("../middleware");

router.use(asyncHandler(authenticate));

router.get("/", asyncHandler(itineraryGet));
router.get("/:id", asyncHandler(itineraryGetOne));
router.post("/", writeLimiter, asyncHandler(createItinerary));
router.put("/", writeLimiter, asyncHandler(itineraryUpdateLegacy));
router.put("/:id", writeLimiter, asyncHandler(itineraryUpdate));
router.patch("/:id", writeLimiter, asyncHandler(itineraryUpdate));
router.delete("/:id", writeLimiter, asyncHandler(itineraryDelete));

module.exports = router;

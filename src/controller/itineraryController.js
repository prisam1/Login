const itineraryModel = require("../model/itineraryModel");
const user = require("../model/userModel");
const {
  checkInputsPresent,
  isValidNumber,
  isValid,
  isValidObjectId,
} = require("../valid/valid");
const { login } = require("./userController");
const moment = require("moment");

const createItinerary = async function (req, res) {
  try {
    if (!checkInputsPresent(req.body))
      return res.status(400).send({
        status: false,
        message: "Enter details to create your account",
      });

    const {
      userId,
      name,
      from,
      to,
      date,
      location,
      duration,
      hotelName,
      totalcost,
    } = req.body;

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid UserId" });

    let date1 = moment(from);
    let date2 = moment(to);
    let date3 = moment(date);
    if (!isValid(date1))
      return res
        .status(400)
        .send({ status: false, message: "Date is required" });

    if (!isValid(date2))
      return res
        .status(400)
        .send({ status: false, message: "Date is required" });

    if (!isValid(date3))
      return res
        .status(400)
        .send({ status: false, message: "Date is required" });

    if (!isValid(name))
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });

    if (!isValid(duration))
      return res
        .status(400)
        .send({ status: false, message: "Duration is required" });

    if (!isValid(location))
      return res
        .status(400)
        .send({ status: false, message: "Location is required" });

    if (!isValid(hotelName))
      return res
        .status(400)
        .send({ status: false, message: "Hotel name is required" });

    if (!isValid(totalcost))
      return res
        .status(400)
        .send({ status: false, message: "Total cost is required" });

    let result = await itineraryModel.create(req.body);

    res
      .status(201)
      .send({ status: true, message: "Successfully Created", data: result });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const itineraryUpdate = async function (req, res) {
  try {
    let {
      userId,
      name,
      from,
      to,
      date,
      location,
      duration,
      hotelName,
      totalcost,
    } = req.body;

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid UserId" });

    if (from || from === "") {
      if (!isValid(from))
        return res
          .status(400)
          .send({ status: false, message: "Date should be Required" });
    }

    if (to || to === "") {
      if (!isValid(to))
        return res
          .status(400)
          .send({ status: false, message: "Date should be Required" });
    }
    if (name || name === "") {
      if (!isValid(name))
        return res
          .status(400)
          .send({ status: false, message: "Name should be Required" });
    }

    let date1 = moment(from);
    let date2 = moment(to);
    if (!isValid(date1) && !date.isValid(date2))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid date" });

    if (date || date === "") {
      if (!isValid(date))
        return res
          .status(400)
          .send({ status: false, message: "Date is required" });
    }
    if (location || location === "") {
      if (!isValid(location))
        return res
          .status(400)
          .send({ status: false, message: "Location is required" });
    }
    if (duration || duration === "") {
      if (!isValid(duration))
        return res
          .status(400)
          .send({ status: false, message: "Duration is required" });
    }

    if (hotelName || hotelName === "") {
      if (!isValid(hotelName))
        return res
          .status(400)
          .send({ status: false, message: "Hotel Name is required" });
    }
    if (totalcost || totalcost === "") {
      if (!isValid(totalcost))
        return res
          .status(400)
          .send({ status: false, message: "Total cost is required" });
    }
    let update = await itineraryModel.findByIdAndUpdate(
      { _id: userId },
      { ...req.body },
      { new: true }
    );

    res
      .status(200)
      .send({ status: true, message: "Successfully Update", data: update });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const itineraryGet = async function (req, res) {
  try {
    const { page = 1, limit = 10, search = "", sortBy = "date" } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    };

    const total = await itineraryModel.countDocuments(query);
    const itineraries = await itineraryModel
      .find(query)
      .sort({ [sortBy]: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      data: itineraries,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createItinerary, itineraryUpdate, itineraryGet };

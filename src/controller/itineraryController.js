const itineraryModel = require("../model/itineraryModel");
const { validateItinerary, sameRoute, isValidObjectId, escapeRegex } = require("../valid/valid");

const SORT_FIELDS = ["date", "name", "totalcost", "createdAt", "updatedAt"];
const MAX_LIMIT = 100;

const toInt = (value, fallback, min, max) => {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

const findOwned = (id, userId) => itineraryModel.findOne({ _id: id, userId });

const itineraryGet = async (req, res) => {
  const page = toInt(req.query.page, 1, 1, 100000);
  const limit = toInt(req.query.limit, 10, 1, MAX_LIMIT);
  const sortBy = SORT_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : "date";
  const order = req.query.order === "desc" ? -1 : 1;
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 80) : "";

  const query = { userId: req.user.userId };
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    query.$or = [{ name: pattern }, { location: pattern }, { from: pattern }, { to: pattern }, { hotelName: pattern }];
  }

  const [total, itineraries] = await Promise.all([
    itineraryModel.countDocuments(query),
    itineraryModel
      .find(query)
      .sort({ [sortBy]: order, _id: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  res.status(200).send({
    status: true,
    data: itineraries,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total,
    limit,
  });
};

const itineraryGetOne = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Invalid itinerary id" });
  const itinerary = await findOwned(id, req.user.userId).lean();
  if (!itinerary) return res.status(404).send({ status: false, message: "Itinerary not found" });
  res.status(200).send({ status: true, data: itinerary });
};

const createItinerary = async (req, res) => {
  const { value, error } = validateItinerary(req.body);
  if (error) return res.status(400).send({ status: false, message: error });
  if (sameRoute(value.from, value.to)) {
    return res.status(400).send({ status: false, message: "Destination must be different from the starting point" });
  }

  const result = await itineraryModel.create({ ...value, userId: req.user.userId });
  res.status(201).send({ status: true, message: "Itinerary created successfully", data: result });
};

const updateById = async (id, req, res) => {
  if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Invalid itinerary id" });

  const { value, error } = validateItinerary(req.body, { partial: true });
  if (error) return res.status(400).send({ status: false, message: error });

  const itinerary = await findOwned(id, req.user.userId);
  if (!itinerary) return res.status(404).send({ status: false, message: "Itinerary not found" });

  const from = value.from ?? itinerary.from;
  const to = value.to ?? itinerary.to;
  if (sameRoute(from, to)) {
    return res.status(400).send({ status: false, message: "Destination must be different from the starting point" });
  }

  itinerary.set(value);
  await itinerary.save();
  res.status(200).send({ status: true, message: "Itinerary updated successfully", data: itinerary });
};

const itineraryUpdate = (req, res) => updateById(req.params.id, req, res);

// Older clients send the itinerary id in `userId` to PUT /api/itinerary.
const itineraryUpdateLegacy = (req, res) => {
  const { userId, ...changes } = req.body || {};
  req.body = changes;
  return updateById(typeof userId === "string" ? userId : "", req, res);
};

const itineraryDelete = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Invalid itinerary id" });
  const result = await itineraryModel.deleteOne({ _id: id, userId: req.user.userId });
  if (!result.deletedCount) return res.status(404).send({ status: false, message: "Itinerary not found" });
  res.status(200).send({ status: true, message: "Itinerary deleted successfully" });
};

module.exports = {
  createItinerary,
  itineraryGet,
  itineraryGetOne,
  itineraryUpdate,
  itineraryUpdateLegacy,
  itineraryDelete,
};

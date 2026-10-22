const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const config = require("../config");
const { isValidObjectId } = require("../valid/valid");

const authenticate = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).send({ status: false, message: "Please log in to continue" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret, { algorithms: ["HS256"] });
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Your session has expired. Please log in again." : "Invalid session. Please log in again.";
    return res.status(401).send({ status: false, message });
  }

  try {
    if (!isValidObjectId(decoded.userId)) {
      return res.status(401).send({ status: false, message: "Invalid session. Please log in again." });
    }
    const user = await userModel.findById(decoded.userId).select("name").lean();
    if (!user) {
      return res.status(401).send({ status: false, message: "Your account no longer exists." });
    }
    req.user = { userId: String(user._id), name: user.name };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };

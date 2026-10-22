const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const config = require("../config");
const { validateRegistration, validateLogin, escapeRegex } = require("../valid/valid");

const DUMMY_HASH = bcrypt.hashSync("timing-attack-placeholder", 10);

const findByEmail = (email) => userModel.findOne({ email: new RegExp(`^${escapeRegex(email.trim())}$`, "i") });

const register = async (req, res) => {
  if (!config.allowRegistration) {
    return res.status(403).send({ status: false, message: "Registration is currently disabled" });
  }

  const { value, error } = validateRegistration(req.body);
  if (error) return res.status(400).send({ status: false, message: error });

  if (await findByEmail(value.email).select("_id").lean()) {
    return res.status(409).send({ status: false, message: "An account with this email already exists" });
  }

  const password = await bcrypt.hash(value.password, 10);
  try {
    const user = await userModel.create({ ...value, password });
    return res.status(201).send({
      status: true,
      message: "Account created successfully",
      data: { userId: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send({ status: false, message: "An account with this email already exists" });
    }
    throw err;
  }
};

const login = async (req, res) => {
  const { value, error } = validateLogin(req.body);
  if (error) return res.status(400).send({ status: false, message: error });

  const user = await findByEmail(value.email).select("+password");
  const match = await bcrypt.compare(value.password, user?.password || DUMMY_HASH);
  if (!user || !match) {
    return res.status(401).send({ status: false, message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: String(user._id), name: user.name }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    algorithm: "HS256",
  });

  return res.status(200).send({
    status: true,
    message: "Logged in successfully",
    data: { userId: user._id, name: user.name, token },
  });
};

const me = async (req, res) => {
  const user = await userModel.findById(req.user.userId).lean();
  if (!user) return res.status(401).send({ status: false, message: "Your account no longer exists." });
  return res.status(200).send({
    status: true,
    data: { userId: user._id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt },
  });
};

module.exports = { register, login, me };

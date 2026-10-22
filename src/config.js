require("dotenv").config();
const crypto = require("crypto");

const list = (value) =>
  (value || "")
    .split(",")
    .map((v) => v.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const mongoUri = process.env.MONGO_STRING || process.env.MONGO_URI;
if (!mongoUri) {
  console.error("Missing MONGO_STRING environment variable. Set it to your MongoDB connection string.");
  process.exit(1);
}

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  jwtSecret = crypto.randomBytes(48).toString("hex");
  console.warn("JWT_SECRET is not set: using a random secret. Sessions will reset on every restart. Set JWT_SECRET in production.");
} else if (jwtSecret.length < 32) {
  console.warn("JWT_SECRET is shorter than 32 characters. Use a long random value.");
}

const trustProxy = process.env.TRUST_PROXY ?? "1";

module.exports = {
  port: Number(process.env.PORT) || 5000,
  mongoUri,
  corsOrigins: list(process.env.CORS_ORIGINS),
  trustProxy: trustProxy === "false" ? false : /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy,
  allowRegistration: (process.env.ALLOW_REGISTRATION || "true").trim().toLowerCase() !== "false",
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || "2d",
  },
};

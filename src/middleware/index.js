const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const stripOperators = (value) => {
  if (Array.isArray(value)) return value.map(stripOperators);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith("$") && !key.includes("."))
        .map(([key, v]) => [key, stripOperators(v)])
    );
  }
  return value;
};

const sanitize = (req, _res, next) => {
  if (req.body && typeof req.body === "object") req.body = stripOperators(req.body);
  if (req.query && typeof req.query === "object") {
    const clean = stripOperators(req.query);
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, clean);
  }
  next();
};

const requireDatabase = (_req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  res.status(503).send({ status: false, message: "The service is starting up. Please try again in a moment." });
};

const limiter = (windowMs, limit, message, extra = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { status: false, message },
    ...extra,
  });

const loginLimiter = limiter(15 * 60 * 1000, 10, "Too many failed login attempts. Please try again in 15 minutes.", {
  skipSuccessfulRequests: true,
});
const registerLimiter = limiter(60 * 60 * 1000, 10, "Too many accounts created from this network. Please try again later.");
const writeLimiter = limiter(60 * 1000, 60, "Too many requests. Please slow down.");
const apiLimiter = limiter(60 * 1000, 300, "Too many requests. Please slow down.");

const notFound = (_req, res) => res.status(404).send({ status: false, message: "Route not found" });

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  if (err.type === "entity.parse.failed") return res.status(400).send({ status: false, message: "Malformed JSON body" });
  if (err.type === "entity.too.large") return res.status(413).send({ status: false, message: "Request body is too large" });
  if (err.message === "Not allowed by CORS") return res.status(403).send({ status: false, message: "Origin not allowed" });
  if (err.name === "CastError") return res.status(400).send({ status: false, message: "Invalid id" });
  if (err.name === "ValidationError") {
    const first = Object.values(err.errors || {})[0];
    return res.status(400).send({ status: false, message: first?.message || "Invalid data" });
  }
  if (err.code === 11000) return res.status(409).send({ status: false, message: "This record already exists" });
  console.error(`[error] ${req.method} ${req.originalUrl}:`, err);
  res.status(500).send({ status: false, message: "Something went wrong. Please try again later." });
};

module.exports = {
  asyncHandler,
  sanitize,
  requireDatabase,
  loginLimiter,
  registerLimiter,
  writeLimiter,
  apiLimiter,
  notFound,
  errorHandler,
};

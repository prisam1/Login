const config = require("./src/config");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const authRoute = require("./src/routes/auth.route");
const itineraryRoute = require("./src/routes/itinerary.route");
const { sanitize, requireDatabase, apiLimiter, notFound, errorHandler } = require("./src/middleware");

const app = express();
app.set("trust proxy", config.trustProxy);
app.disable("x-powered-by");

app.use(helmet());

if (!config.corsOrigins.length) {
  console.warn("CORS_ORIGINS is not set: allowing requests from any origin. Set it in production.");
}
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || !config.corsOrigins.length || config.corsOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(sanitize);

app.get("/api/health", (_req, res) => {
  const up = mongoose.connection.readyState === 1;
  res.status(up ? 200 : 503).send({ status: up, database: up ? "up" : "down", uptime: Math.round(process.uptime()) });
});
app.get("/", (_req, res) => res.send({ name: "Itinerary API", health: "/api/health" }));

app.use("/api", apiLimiter, requireDatabase);
app.use("/api/auth", authRoute);
app.use("/api/itinerary", itineraryRoute);

app.use(notFound);
app.use(errorHandler);

mongoose.set("strictQuery", true);

let shuttingDown = false;
const connect = async (attempt = 1) => {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");
  } catch (err) {
    if (shuttingDown) return;
    const delay = Math.min(30000, 2000 * attempt);
    console.error(`MongoDB connection failed (attempt ${attempt}): ${err.message}. Retrying in ${delay / 1000}s`);
    setTimeout(() => connect(attempt + 1), delay);
  }
};

mongoose.connection.on("disconnected", () => !shuttingDown && console.warn("MongoDB disconnected"));

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
  connect();
});

const shutdown = async (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received, shutting down`);
  setTimeout(() => process.exit(1), 10000).unref();
  server.close();
  await mongoose.disconnect().catch(() => {});
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));

module.exports = app;

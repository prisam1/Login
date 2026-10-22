const mongoose = require("mongoose");

const NAME_RE = /^[a-zA-Z\s]{2,20}$/;
const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PASSWORD_RE = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,15}$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

const LIMITS = {
  tripName: 60,
  place: 60,
  location: 80,
  hotel: 80,
  duration: 30,
  maxCost: 100000000,
};

const isString = (value) => typeof value === "string";

const collapse = (value) => (isString(value) ? value.replace(/\s+/g, " ").trim() : "");

const isValidObjectId = (id) => isString(id) && mongoose.Types.ObjectId.isValid(id) && /^[a-f\d]{24}$/i.test(id);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isRealDate = (value) => {
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const [, y, mo, d] = m.map(Number);
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d && value >= "2000-01-01" && value <= "2100-12-31";
};

const validateRegistration = (body = {}) => {
  const { name, email, phone, password } = body;
  if (!isString(name) || !collapse(name)) return { error: "Name is required" };
  if (!NAME_RE.test(collapse(name))) return { error: "Name must be 2–20 letters and spaces" };
  if (!isString(email) || !email.trim()) return { error: "Email is required" };
  if (email.trim().length > 100 || !EMAIL_RE.test(email.trim())) return { error: "Enter a valid email address" };
  if (!isString(phone) || !phone.trim()) return { error: "Phone number is required" };
  if (!PHONE_RE.test(phone.trim())) return { error: "Enter a valid 10-digit mobile number starting with 6–9" };
  if (!isString(password) || !password) return { error: "Password is required" };
  if (!PASSWORD_RE.test(password)) {
    return { error: "Password must be 8–15 characters with an uppercase letter, a lowercase letter, a number and one of @ # $ % &" };
  }
  return { value: { name: collapse(name), email: email.trim().toLowerCase(), phone: phone.trim(), password } };
};

const validateLogin = (body = {}) => {
  const { email, password } = body;
  if (!isString(email) || !email.trim() || !isString(password) || !password) {
    return { error: "Email and password are required" };
  }
  if (email.length > 100 || password.length > 100 || !EMAIL_RE.test(email.trim())) {
    return { error: "Invalid email or password" };
  }
  return { value: { email: email.trim(), password } };
};

const textField = (label, max) => (raw) => {
  if (!isString(raw)) return { error: `${label} is required` };
  const value = collapse(raw);
  if (!value) return { error: `${label} is required` };
  if (value.length < 2) return { error: `${label} must be at least 2 characters` };
  if (value.length > max) return { error: `${label} must be at most ${max} characters` };
  if (/[<>]/.test(value)) return { error: `${label} can't contain < or >` };
  return { value };
};

const itineraryFields = {
  name: textField("Trip name", LIMITS.tripName),
  from: textField("Starting point", LIMITS.place),
  to: textField("Destination", LIMITS.place),
  location: textField("Location", LIMITS.location),
  hotelName: textField("Hotel name", LIMITS.hotel),
  date: (raw) => {
    if (!isString(raw) || !raw.trim()) return { error: "Travel date is required" };
    if (!isRealDate(raw.trim())) return { error: "Travel date must be a valid date (YYYY-MM-DD) between 2000 and 2100" };
    return { value: raw.trim() };
  },
  duration: (raw) => {
    const str = typeof raw === "number" ? String(raw) : isString(raw) ? collapse(raw) : "";
    if (!str) return { error: "Duration is required" };
    if (/^\d+$/.test(str)) {
      const n = Number(str);
      if (n < 1 || n > 365) return { error: "Duration must be between 1 and 365 days" };
      return { value: `${n} ${n === 1 ? "day" : "days"}` };
    }
    if (str.length > LIMITS.duration || /[<>]/.test(str)) return { error: "Duration is invalid" };
    return { value: str };
  },
  totalcost: (raw) => {
    const n = typeof raw === "number" ? raw : isString(raw) && raw.trim() !== "" ? Number(raw) : NaN;
    if (!Number.isFinite(n)) return { error: "Total cost must be a number" };
    if (n < 0) return { error: "Total cost can't be negative" };
    if (n > LIMITS.maxCost) return { error: "Total cost is too large" };
    if (Math.abs(Math.round(n * 100) - n * 100) > 1e-6) return { error: "Total cost can have at most 2 decimal places" };
    return { value: Math.round(n * 100) / 100 };
  },
  public: (raw) => (typeof raw === "boolean" ? { value: raw } : { error: "public must be true or false" }),
};

const REQUIRED_ON_CREATE = ["name", "from", "to", "date", "location", "duration", "hotelName", "totalcost"];

const validateItinerary = (body = {}, { partial = false } = {}) => {
  const value = {};
  for (const [field, check] of Object.entries(itineraryFields)) {
    const provided = body[field] !== undefined && body[field] !== null;
    if (!provided) {
      if (!partial && REQUIRED_ON_CREATE.includes(field)) return { error: check(undefined).error };
      continue;
    }
    const result = check(body[field]);
    if (result.error) return { error: result.error };
    value[field] = result.value;
  }
  if (partial && !Object.keys(value).length) return { error: "Provide at least one field to update" };
  return { value };
};

const sameRoute = (from, to) => isString(from) && isString(to) && from.trim().toLowerCase() === to.trim().toLowerCase();

module.exports = {
  LIMITS,
  isValidObjectId,
  escapeRegex,
  validateRegistration,
  validateLogin,
  validateItinerary,
  sameRoute,
};

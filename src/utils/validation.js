export const NAME_RE = /^[a-zA-Z\s]{2,20}$/;
export const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const PHONE_RE = /^[6-9]\d{9}$/;
export const PASSWORD_RE = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,15}$/;

export const LIMITS = {
  tripName: 60,
  place: 60,
  location: 80,
  hotel: 80,
  maxDays: 365,
  maxCost: 100000000,
};

export const passwordRules = [
  { id: "length", label: "8–15 characters", test: (v) => v.length >= 8 && v.length <= 15 },
  { id: "upper", label: "An uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "A lowercase letter", test: (v) => /[a-z]/.test(v) },
  { id: "number", label: "A number", test: (v) => /\d/.test(v) },
  { id: "special", label: "One of @ # $ % &", test: (v) => /[@#$%&]/.test(v) },
  { id: "allowed", label: "No spaces or other symbols", test: (v) => v.length > 0 && /^[a-zA-Z0-9@#$%&]+$/.test(v) },
];

export const normalizePhone = (value) => {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
};

export const collapseSpaces = (value) => String(value || "").replace(/\s+/g, " ").trim();

export const requiredText = (label, max) => (value) => {
  const v = collapseSpaces(value);
  if (!v) return `${label} is required`;
  if (v.length < 2) return `${label} must be at least 2 characters`;
  if (v.length > max) return `${label} must be at most ${max} characters`;
  if (/[<>]/.test(v)) return `${label} can't contain < or >`;
  return true;
};

const currencyFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const weekdayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "long" });

export const parseDate = (value) => {
  if (!value) return null;
  const str = String(value).trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  const d = iso ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])) : new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const toInputDate = (value) => {
  const d = parseDate(value);
  if (!d) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export const todayInputDate = () => toInputDate(new Date());

export const formatDate = (value) => {
  const d = parseDate(value);
  return d ? dateFmt.format(d) : value ? String(value) : "—";
};

export const formatWeekday = (value) => {
  const d = parseDate(value);
  return d ? weekdayFmt.format(d) : "";
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? currencyFmt.format(n) : String(value);
};

export const tripStatus = (value) => {
  const d = parseDate(value);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return { key: "today", label: "Today", tone: "success" };
  if (diff === 1) return { key: "upcoming", label: "Tomorrow", tone: "primary" };
  if (diff > 1) return { key: "upcoming", label: diff <= 30 ? `In ${diff} days` : "Upcoming", tone: "primary" };
  return { key: "past", label: "Completed", tone: "neutral" };
};

export const formatDuration = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const str = String(value).trim();
  if (/^\d+$/.test(str)) return `${str} ${Number(str) === 1 ? "day" : "days"}`;
  return str;
};

export const parseDurationDays = (value) => {
  const m = /^\s*(\d+)/.exec(String(value || ""));
  return m ? Number(m[1]) : "";
};

export const display = (value) => {
  if (value === null || value === undefined) return "—";
  const str = String(value).trim();
  return str || "—";
};

export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const initials = (name) =>
  String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("") || "?";

export const firstName = (name) => String(name || "").trim().split(/\s+/)[0] || "Traveller";

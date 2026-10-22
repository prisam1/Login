import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ArrowLeftRight, CalendarDays, CircleAlert, Hotel, Route, Sparkles, Wallet } from "lucide-react";
import Field, { Counter, describedBy } from "../common/Field";
import ConfirmDialog from "../common/ConfirmDialog";
import ItineraryCard from "./ItineraryCard";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import { selectAuth } from "../../redux/authSlice";
import { collapseSpaces, LIMITS, requiredText } from "../../utils/validation";
import { parseDate, parseDurationDays, toInputDate, todayInputDate } from "../../utils/format";

const MIN_DATE = "2000-01-01";
const MAX_DATE = "2100-12-31";

export const toFormValues = (itinerary = {}) => ({
  name: itinerary.name || "",
  from: itinerary.from || "",
  to: itinerary.to || "",
  date: toInputDate(itinerary.date),
  durationDays: parseDurationDays(itinerary.duration),
  location: itinerary.location || "",
  hotelName: itinerary.hotelName || "",
  totalcost: itinerary.totalcost === null || itinerary.totalcost === undefined ? "" : String(itinerary.totalcost),
});

export const toPayload = (values) => {
  const days = Number(values.durationDays);
  return {
    name: collapseSpaces(values.name),
    from: collapseSpaces(values.from),
    to: collapseSpaces(values.to),
    date: values.date,
    duration: `${days} ${days === 1 ? "day" : "days"}`,
    location: collapseSpaces(values.location),
    hotelName: collapseSpaces(values.hotelName),
    totalcost: Math.round(Number(values.totalcost) * 100) / 100,
  };
};

const isLegacyDuration = (value) => value && !/^\s*\d+\s*(days?)?\s*$/i.test(String(value));

const ItineraryForm = ({ initial, mode, saving, serverError, onSubmit, onCancel, legacyDuration }) => {
  const { token } = useSelector(selectAuth);
  const defaultValues = useMemo(() => toFormValues(initial), [initial]);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setFocus,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ defaultValues, mode: "onTouched" });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);
  useEffect(() => setFocus("name"), [setFocus]);

  const { blocker, allowNavigation } = useUnsavedChanges(isDirty && !!token && !saving);
  const values = watch();
  const busy = saving || isSubmitting;

  const preview = useMemo(() => {
    const days = Number(values.durationDays);
    return {
      name: collapseSpaces(values.name) || "Your trip name",
      from: collapseSpaces(values.from) || "From",
      to: collapseSpaces(values.to) || "To",
      date: values.date,
      duration: Number.isInteger(days) && days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : "",
      location: collapseSpaces(values.location),
      hotelName: collapseSpaces(values.hotelName),
      totalcost: values.totalcost === "" ? "" : Number(values.totalcost),
    };
  }, [values]);

  const pastDate = (() => {
    const d = parseDate(values.date);
    if (!d) return false;
    return values.date < todayInputDate();
  })();

  const swap = () => {
    const { from, to } = getValues();
    setValue("from", to, { shouldDirty: true, shouldValidate: !!(from && to) });
    setValue("to", from, { shouldDirty: true, shouldValidate: !!(from && to) });
  };

  const submit = (formValues) => onSubmit(toPayload(formValues), allowNavigation);

  const sameRoute = (v) =>
    collapseSpaces(v).toLowerCase() !== collapseSpaces(getValues("from")).toLowerCase() || "Destination must be different from the starting point";

  return (
    <div className="form-layout">
      <form className="card form-card" onSubmit={handleSubmit(submit)} noValidate aria-busy={busy}>
        {serverError && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: "1.25rem" }}>
            <CircleAlert aria-hidden="true" />
            <span>{serverError}</span>
          </div>
        )}

        <section className="form-section" aria-labelledby="sec-basics">
          <h2 id="sec-basics" className="form-section-title">
            <Sparkles aria-hidden="true" /> Trip basics
          </h2>
          <Field id="name" label="Trip name" error={errors.name?.message} counter={<Counter value={values.name} max={LIMITS.tripName} />}>
            <input
              id="name"
              className="input"
              placeholder="e.g. Goa beach getaway"
              maxLength={LIMITS.tripName}
              autoComplete="off"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={describedBy("name", errors.name)}
              disabled={busy}
              {...register("name", { validate: requiredText("Trip name", LIMITS.tripName) })}
            />
          </Field>
        </section>

        <section className="form-section" aria-labelledby="sec-route">
          <h2 id="sec-route" className="form-section-title">
            <Route aria-hidden="true" /> Route
          </h2>
          <div className="route-fields">
            <Field id="from" label="From" error={errors.from?.message}>
              <input
                id="from"
                className="input"
                placeholder="e.g. Kolkata"
                maxLength={LIMITS.place}
                autoComplete="off"
                aria-invalid={errors.from ? "true" : "false"}
                aria-describedby={describedBy("from", errors.from)}
                disabled={busy}
                {...register("from", { validate: requiredText("Starting point", LIMITS.place) })}
              />
            </Field>
            <button
              type="button"
              className="swap-button"
              onClick={swap}
              disabled={busy || (!values.from && !values.to)}
              aria-label="Swap from and to"
              title="Swap"
            >
              <ArrowLeftRight />
            </button>
            <Field id="to" label="To" error={errors.to?.message}>
              <input
                id="to"
                className="input"
                placeholder="e.g. Goa"
                maxLength={LIMITS.place}
                autoComplete="off"
                aria-invalid={errors.to ? "true" : "false"}
                aria-describedby={describedBy("to", errors.to)}
                disabled={busy}
                {...register("to", {
                  validate: { text: requiredText("Destination", LIMITS.place), sameRoute },
                })}
              />
            </Field>
          </div>
        </section>

        <section className="form-section" aria-labelledby="sec-when">
          <h2 id="sec-when" className="form-section-title">
            <CalendarDays aria-hidden="true" /> When
          </h2>
          <div className="form-grid cols-2">
            <Field
              id="date"
              label="Travel date"
              error={errors.date?.message}
              hint={pastDate ? "This date is in the past — the trip will show as completed." : undefined}
            >
              <input
                id="date"
                type="date"
                className="input"
                min={MIN_DATE}
                max={MAX_DATE}
                aria-invalid={errors.date ? "true" : "false"}
                aria-describedby={describedBy("date", errors.date, pastDate)}
                disabled={busy}
                {...register("date", {
                  required: "Travel date is required",
                  validate: (v) => {
                    if (!parseDate(v)) return "Enter a valid date";
                    if (v < MIN_DATE || v > MAX_DATE) return "Pick a date between 2000 and 2100";
                    return true;
                  },
                })}
              />
            </Field>
            <Field
              id="durationDays"
              label="Duration"
              error={errors.durationDays?.message}
              hint={isLegacyDuration(legacyDuration) ? `Previously saved as “${legacyDuration}”.` : undefined}
            >
              <div className="input-wrap">
                <input
                  id="durationDays"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={LIMITS.maxDays}
                  step={1}
                  placeholder="3"
                  className="input"
                  style={{ paddingRight: "3.5rem" }}
                  aria-invalid={errors.durationDays ? "true" : "false"}
                  aria-describedby={describedBy("durationDays", errors.durationDays, isLegacyDuration(legacyDuration))}
                  disabled={busy}
                  onKeyDown={(e) => ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()}
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("durationDays", {
                    validate: (v) => {
                      if (v === "" || v === null || v === undefined) return "Duration is required";
                      const n = Number(v);
                      if (!Number.isInteger(n)) return "Enter a whole number of days";
                      if (n < 1) return "Duration must be at least 1 day";
                      if (n > LIMITS.maxDays) return `Duration can be at most ${LIMITS.maxDays} days`;
                      return true;
                    },
                  })}
                />
                <span className="input-suffix">{Number(values.durationDays) === 1 ? "day" : "days"}</span>
              </div>
            </Field>
          </div>
        </section>

        <section className="form-section" aria-labelledby="sec-stay">
          <h2 id="sec-stay" className="form-section-title">
            <Hotel aria-hidden="true" /> Stay
          </h2>
          <div className="form-grid cols-2">
            <Field id="location" label="Location" error={errors.location?.message} counter={<Counter value={values.location} max={LIMITS.location} />}>
              <input
                id="location"
                className="input"
                placeholder="e.g. Baga Beach, North Goa"
                maxLength={LIMITS.location}
                autoComplete="off"
                aria-invalid={errors.location ? "true" : "false"}
                aria-describedby={describedBy("location", errors.location)}
                disabled={busy}
                {...register("location", { validate: requiredText("Location", LIMITS.location) })}
              />
            </Field>
            <Field id="hotelName" label="Hotel" error={errors.hotelName?.message} counter={<Counter value={values.hotelName} max={LIMITS.hotel} />}>
              <input
                id="hotelName"
                className="input"
                placeholder="e.g. Sea Breeze Resort"
                maxLength={LIMITS.hotel}
                autoComplete="off"
                aria-invalid={errors.hotelName ? "true" : "false"}
                aria-describedby={describedBy("hotelName", errors.hotelName)}
                disabled={busy}
                {...register("hotelName", { validate: requiredText("Hotel name", LIMITS.hotel) })}
              />
            </Field>
          </div>
        </section>

        <section className="form-section" aria-labelledby="sec-budget">
          <h2 id="sec-budget" className="form-section-title">
            <Wallet aria-hidden="true" /> Budget
          </h2>
          <Field id="totalcost" label="Total cost" error={errors.totalcost?.message} hint="Include travel, stay and activities.">
            <div className="input-wrap">
              <span className="input-prefix">₹</span>
              <input
                id="totalcost"
                type="number"
                inputMode="decimal"
                min={0}
                max={LIMITS.maxCost}
                step="0.01"
                placeholder="0"
                className="input has-prefix"
                aria-invalid={errors.totalcost ? "true" : "false"}
                aria-describedby={describedBy("totalcost", errors.totalcost, true)}
                disabled={busy}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                onWheel={(e) => e.currentTarget.blur()}
                {...register("totalcost", {
                  validate: (v) => {
                    if (v === "" || v === null || v === undefined) return "Total cost is required";
                    const n = Number(v);
                    if (!Number.isFinite(n)) return "Enter a valid amount";
                    if (n < 0) return "Cost can't be negative";
                    if (n > LIMITS.maxCost) return "That amount is too large";
                    if (Math.abs(Math.round(n * 100) - n * 100) > 1e-6) return "Use at most 2 decimal places";
                    return true;
                  },
                })}
              />
            </div>
          </Field>
        </section>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          {mode === "edit" && (
            <button type="button" className="btn btn-ghost" onClick={() => reset(defaultValues)} disabled={busy || !isDirty}>
              Reset changes
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={busy || (mode === "edit" && !isDirty)}>
            {busy ? (mode === "edit" ? "Saving…" : "Creating…") : mode === "edit" ? "Save changes" : "Create itinerary"}
          </button>
        </div>
        {mode === "edit" && !isDirty && !busy && (
          <p className="field-hint" style={{ textAlign: "right", marginTop: "0.5rem" }}>
            No changes yet.
          </p>
        )}
      </form>

      <aside className="form-aside" aria-label="Preview">
        <p className="form-aside-title">Live preview</p>
        <ItineraryCard itinerary={preview} preview />
        <div className="card tips">
          <strong>Tips</strong>
          <ul>
            <li>Use a short, memorable trip name.</li>
            <li>Duration is counted in days.</li>
            <li>Costs are shown in Indian Rupees (₹).</li>
          </ul>
        </div>
      </aside>

      <ConfirmDialog
        open={blocker.state === "blocked"}
        title="Discard unsaved changes?"
        description="You have changes that haven't been saved. If you leave now, they'll be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        danger
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </div>
  );
};

export default ItineraryForm;

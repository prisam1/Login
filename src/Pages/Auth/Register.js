import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Circle, CircleAlert, CircleCheck, Mail, Phone, User } from "lucide-react";
import { useRegister } from "../../hooks/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AuthLayout from "../../components/Layout/AuthLayout";
import Field, { describedBy } from "../../components/common/Field";
import PasswordInput from "../../components/common/PasswordInput";
import { collapseSpaces, EMAIL_RE, NAME_RE, normalizePhone, PASSWORD_RE, PHONE_RE, passwordRules } from "../../utils/validation";

const Register = () => {
  useDocumentTitle("Create account");
  const navigate = useNavigate();
  const location = useLocation();
  const { handleRegister, loading, error, clearError } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  useEffect(() => setFocus("name"), [setFocus]);

  const password = watch("password") || "";
  const metCount = passwordRules.filter((r) => r.test(password)).length;
  const strengthClass = metCount <= 2 ? "is-weak" : metCount <= 4 ? "is-fair" : "";

  const onSubmit = async ({ name, email, phone, password: pwd }) => {
    const result = await handleRegister({ name: collapseSpaces(name), email: email.trim(), phone, password: pwd });
    if (result.ok) {
      toast.success("Account created successfully!");
      navigate("/login", { replace: true, state: { email: email.trim(), registered: true, from: location.state?.from } });
    } else if (result.field) {
      setError(result.field, { type: "server", message: result.message }, { shouldFocus: true });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning your next trip in seconds."
      footer={
        <>
          Already have an account? <Link to="/login" state={location.state}>Log in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <div className="alert alert-error" role="alert">
            <CircleAlert aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <Field id="name" label="Full name" error={errors.name?.message} hint="Letters and spaces only, 2–20 characters.">
          <div className="input-wrap">
            <User className="input-icon" aria-hidden="true" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              maxLength={20}
              placeholder="Your name"
              className="input has-icon"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={describedBy("name", errors.name, true)}
              disabled={loading}
              {...register("name", {
                onChange: clearError,
                validate: (v) => {
                  const name = collapseSpaces(v);
                  if (!name) return "Name is required";
                  if (!NAME_RE.test(name)) return "Use 2–20 letters and spaces only";
                  return true;
                },
              })}
            />
          </div>
        </Field>

        <Field id="email" label="Email" error={errors.email?.message}>
          <div className="input-wrap">
            <Mail className="input-icon" aria-hidden="true" />
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={100}
              placeholder="you@example.com"
              className="input has-icon"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={describedBy("email", errors.email)}
              disabled={loading}
              {...register("email", {
                onChange: clearError,
                setValueAs: (v) => v.trim(),
                required: "Email is required",
                pattern: { value: EMAIL_RE, message: "Enter a valid email address" },
              })}
            />
          </div>
        </Field>

        <Field id="phone" label="Mobile number" error={errors.phone?.message} hint="10-digit Indian mobile number.">
          <div className="input-wrap">
            <Phone className="input-icon" aria-hidden="true" />
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              className="input has-icon"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={describedBy("phone", errors.phone, true)}
              disabled={loading}
              {...register("phone", {
                onChange: (e) => {
                  clearError();
                  const clean = normalizePhone(e.target.value);
                  if (clean !== e.target.value) setValue("phone", clean);
                },
                required: "Mobile number is required",
                pattern: { value: PHONE_RE, message: "Enter a valid 10-digit number starting with 6–9" },
              })}
            />
          </div>
        </Field>

        <Field id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a password"
            maxLength={15}
            invalid={!!errors.password}
            aria-describedby="password-rules"
            disabled={loading}
            {...register("password", {
              onChange: clearError,
              required: "Password is required",
              pattern: { value: PASSWORD_RE, message: "Password doesn't meet all the requirements below" },
            })}
          />
          <div className={`strength-bar ${strengthClass}`} aria-hidden="true">
            {passwordRules.map((r, i) => (
              <span key={r.id} className={i < metCount ? "is-on" : ""} />
            ))}
          </div>
          <ul id="password-rules" className="password-rules" aria-label="Password requirements">
            {passwordRules.map((rule) => {
              const met = rule.test(password);
              return (
                <li key={rule.id} className={met ? "is-met" : ""}>
                  {met ? <CircleCheck aria-hidden="true" /> : <Circle aria-hidden="true" />}
                  {rule.label}
                  <span className="sr-only">{met ? " (met)" : " (not met)"}</span>
                </li>
              );
            })}
          </ul>
        </Field>

        <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            maxLength={15}
            invalid={!!errors.confirmPassword}
            aria-describedby={describedBy("confirmPassword", errors.confirmPassword)}
            disabled={loading}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (v) => v === password || "Passwords don't match",
            })}
          />
        </Field>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;

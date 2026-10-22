import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircleAlert, CircleCheck, Info, Mail } from "lucide-react";
import { useLogin } from "../../hooks/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AuthLayout from "../../components/Layout/AuthLayout";
import Field, { describedBy } from "../../components/common/Field";
import PasswordInput from "../../components/common/PasswordInput";
import { EMAIL_RE } from "../../utils/validation";
import { safeRedirect } from "../../utils/session";

const Login = () => {
  useDocumentTitle("Log in");
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser, loading, error, clearError } = useLogin();
  const state = location.state || {};

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: { email: state.email || "", password: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    setFocus(state.email ? "password" : "email");
  }, [setFocus, state.email]);

  const onSubmit = async ({ email, password }) => {
    const ok = await loginUser(email, password);
    if (ok) {
      toast.success("Welcome back!", { toastId: "welcome" });
      navigate(safeRedirect(state.from), { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see and manage your itineraries."
      footer={
        <>
          New to Itinerary? <Link to="/register" state={state.from ? { from: state.from } : undefined}>Create an account</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {state.registered && !error && (
          <div className="alert alert-info" role="status">
            <CircleCheck aria-hidden="true" />
            <span>Account created! Log in with your new password to continue.</span>
          </div>
        )}
        {state.from && !state.registered && !error && (
          <div className="alert alert-info" role="status">
            <Info aria-hidden="true" />
            <span>Please log in to continue.</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error" role="alert">
            <CircleAlert aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

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
                setValueAs: (v) => v.trim(),
                required: "Email is required",
                pattern: { value: EMAIL_RE, message: "Enter a valid email address" },
                onChange: clearError,
              })}
            />
          </div>
        </Field>

        <Field id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            maxLength={64}
            invalid={!!errors.password}
            aria-describedby={describedBy("password", errors.password)}
            disabled={loading}
            {...register("password", { required: "Password is required", onChange: clearError })}
          />
        </Field>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
        {loading && (
          <p className="field-hint" style={{ textAlign: "center" }} role="status">
            First login can take up to a minute while the server wakes up.
          </p>
        )}
      </form>
    </AuthLayout>
  );
};

export default Login;

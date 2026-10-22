import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = forwardRef(({ onKeyUp, onBlur, invalid, ...rest }, ref) => {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  return (
    <>
      <div className="input-wrap">
        <Lock className="input-icon" aria-hidden="true" />
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className="input has-icon has-action"
          aria-invalid={invalid ? "true" : "false"}
          onKeyUp={(e) => {
            setCapsLock(e.getModifierState?.("CapsLock") ?? false);
            onKeyUp?.(e);
          }}
          onBlur={(e) => {
            setCapsLock(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        <button
          type="button"
          className="input-action"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {capsLock && (
        <p className="field-hint" style={{ color: "var(--warning)" }}>
          Caps Lock is on
        </p>
      )}
    </>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;

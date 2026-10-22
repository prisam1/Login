import React, { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import "../../style/modal.css";

const Modal = ({ open, onClose, title, description, children, footer, size, dismissible = true }) => {
  const ref = useRef(null);
  const titleId = useId();
  const descId = useId();
  const close = dismissible ? onClose : undefined;
  useFocusTrap(ref, open, close);

  if (!open) return null;

  return createPortal(
    <div className="modal-root">
      <div className="modal-backdrop" onClick={close} aria-hidden="true" />
      <div
        ref={ref}
        className={`modal ${size === "lg" ? "modal-lg" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
      >
        <div className="modal-header">
          <div>
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            {description && (
              <p id={descId} className="modal-description">
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">
              <X />
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

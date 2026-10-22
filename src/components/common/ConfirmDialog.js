import React from "react";
import Modal from "./Modal";

const ConfirmDialog = ({ open, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", danger, onConfirm, onCancel }) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    footer={
      <>
        <button type="button" className="btn btn-secondary" onClick={onCancel} data-autofocus={danger ? true : undefined}>
          {cancelLabel}
        </button>
        <button type="button" className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm} data-autofocus={danger ? undefined : true}>
          {confirmLabel}
        </button>
      </>
    }
  >
    <p style={{ color: "var(--text-muted)" }}>{description}</p>
  </Modal>
);

export default ConfirmDialog;

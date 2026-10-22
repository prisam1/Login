import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const useFocusTrap = (ref, active, onEscape) => {
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement;
    const focusables = () => [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    (node.querySelector("[data-autofocus]") || focusables()[0] || node).focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === "Escape" && escapeRef.current) {
        e.stopPropagation();
        escapeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [ref, active]);
};

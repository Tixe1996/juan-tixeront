"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function DialogShell({ titleId, onClose, origin, className = "", children }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  const closing = useRef(false);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const box = dialog.getBoundingClientRect();
      const transform = origin
        ? `translate(${origin.x + origin.width / 2 - box.x - box.width / 2}px, ${origin.y + origin.height / 2 - box.y - box.height / 2}px) scale(${origin.width / box.width}, ${origin.height / box.height})`
        : "translateY(18px) scale(.96)";
      dialog.animate([
        { transform, opacity: 0.3, borderRadius: origin ? "50%" : "8px" },
        { transform: "none", opacity: 1, borderRadius: "8px" },
      ], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  async function close() {
    if (closing.current) return;
    closing.current = true;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await ref.current.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(12px) scale(.98)" }], { duration: 160 }).finished.catch(() => {});
    }
    closeRef.current();
  }

  return (
    <dialog ref={ref} className={`portfolio-dialog ${className}`} aria-labelledby={titleId} aria-modal="true"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [...ref.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
          .filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = ref.current.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
      }}>
      <button type="button" className="icon-button dialog-close" aria-label="Close dialog" title="Close" onClick={close} autoFocus><X size={22} /></button>
      <div className="dialog-content">{children}</div>
    </dialog>
  );
}

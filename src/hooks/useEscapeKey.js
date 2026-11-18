import { useEffect } from "react";

/**
 * Closes a dialog on Escape. Every modal in the app uses this so the
 * keyboard route out of a dialog is always the same as the pointer route.
 */
export function useEscapeKey(onEscape, active = true) {
  useEffect(() => {
    if (!active) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onEscape();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, active]);
}

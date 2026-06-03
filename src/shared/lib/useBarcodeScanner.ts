// import { useEffect, useRef } from "react";
// import eventBus from "./eventBus";

// export const useBarcodeScanner = () => {
//   const buffer = useRef("");
//   const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (timeout.current) clearTimeout(timeout.current);

//       // Enterni bloklash
//       if (e.key === "Enter") {
//         e.preventDefault();
//         e.stopPropagation();
//       }

//       // Faqat bitta belgilarni yig‘amiz
//       if (e.key.length === 1) buffer.current += e.key;

//       // 150ms ichida tugagan bo‘lsa, bu barcode deb hisoblanadi
//       timeout.current = setTimeout(() => {
//         const scanned = buffer.current.trim();
//         if (scanned.length > 3) {
//           eventBus.dispatch("BARCODE_SCANNED", scanned);
//         }
//         buffer.current = "";
//       }, 150);
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, []);
// };

import { useEffect, useRef } from "react";
import eventBus from "./eventBus";

export const useBarcodeScanner = () => {
  const buffer = useRef("");
  const lastTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const elapsed = now - lastTime.current;

      if (elapsed > 40) {
        if (buffer.current.length >= 2) {
          window.dispatchEvent(new CustomEvent("SCANNER_COMPLETE"));
        }
        buffer.current = "";
      }
      lastTime.current = now;

      // Faqat birinchi char uchun (yangi ketma-ketlik boshi) active inputga ruxsat
      // Char 2+ da esa scanner tezligida kelgan bo’lsa — hamma holatda scanner sifatida ishla
      if (buffer.current.length === 0) {
        const active = document.activeElement as HTMLElement | null;
        if (
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.tagName === "BUTTON" ||
            active.isContentEditable)
        ) {
          if (e.key.length === 1) buffer.current += e.key;
          return;
        }
      }

      if (e.key === "Enter") {
        if (buffer.current.length >= 6) {
          e.preventDefault();
          e.stopImmediatePropagation();
          eventBus.dispatch("BARCODE_SCANNED", buffer.current);
          window.dispatchEvent(new CustomEvent("SCANNER_COMPLETE"));
          buffer.current = "";
        }
        return;
      }

      if (e.key.length === 1) {
        buffer.current += e.key;
        e.preventDefault();
        if (buffer.current.length === 2) {
          window.dispatchEvent(new CustomEvent("SCANNER_ACTIVE"));
        }
        if (buffer.current.length >= 2) {
          e.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);
};

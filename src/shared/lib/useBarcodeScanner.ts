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
      // 🔴 AGAR USER INPUTDA YOZAYOTGAN BO‘LSA — CHIQIB KETAMIZ
      const active = document.activeElement as HTMLElement | null;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "BUTTON" ||
          active.isContentEditable)
      ) {
        return;
      }

      const now = Date.now();

      // Agar sekin yozilsa — bu scanner emas
      if (now - lastTime.current > 40) {
        buffer.current = "";
      }

      lastTime.current = now;

      // Browserga yozilishiga yo‘l bermaymiz
      
      if (e.key === "Enter") {
        if (buffer.current.length >= 6) {
          e.preventDefault();
          e.stopImmediatePropagation();
          eventBus.dispatch("BARCODE_SCANNED", buffer.current);
          buffer.current = "";
        }
        return;
      }

      if (e.key.length === 1) {
        buffer.current += e.key;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);
};

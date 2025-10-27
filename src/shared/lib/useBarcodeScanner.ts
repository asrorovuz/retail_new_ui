import { useEffect, useRef } from "react";
import eventBus from "./eventBus";

export const useBarcodeScanner = () => {
  const buffer = useRef("");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (timeout.current) clearTimeout(timeout.current);

      // Enterni bloklash
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }

      // Faqat bitta belgilarni yig‘amiz
      if (e.key.length === 1) buffer.current += e.key;

      // 150ms ichida tugagan bo‘lsa, bu barcode deb hisoblanadi
      timeout.current = setTimeout(() => {
        const scanned = buffer.current.trim();
        if (scanned.length > 3) {
          console.log("✅ Barcode scanned:", scanned);
          eventBus.dispatch("BARCODE_SCANNED", scanned);
        }
        buffer.current = "";
      }, 150);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
};

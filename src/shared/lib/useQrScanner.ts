import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import eventBus from "./eventBus";

interface UseQrScannerOptions {
  elementId: string;
  fps?: number;
  qrbox?: number;
}

export const useQrScanner = ({ elementId, fps = 10, qrbox = 200 }: UseQrScannerOptions) => {
  useEffect(() => {
    const scanner = new Html5Qrcode(elementId);

    scanner.start(
      { facingMode: "environment" },
      { fps, qrbox },
      (decodedText) => {
        console.log("✅ QR scanned:", decodedText);
        eventBus.dispatch("QR_SCANNED", decodedText);
      },
      (errorMessage) => {
        console.warn("QR scanning error:", errorMessage);
      }
    );

    return () => {
      scanner.stop().catch(console.error);
    };
  }, [elementId, fps, qrbox]);
};

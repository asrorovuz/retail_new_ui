import { useBarcodeScanner } from "@/shared/lib/useBarcodeScanner";
import { Outlet } from "react-router";

export const AppLayout = () => {
  useBarcodeScanner(); // global barcode listener
  return (
    <div className="h-screen w-screen overflow-hidden p-3 bg-slate-200">
      <Outlet />
    </div>
  );
};

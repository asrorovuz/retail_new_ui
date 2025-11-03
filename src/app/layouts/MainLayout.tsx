import { useBarcodeScanner } from "@/shared/lib/useBarcodeScanner";
import Header from "@/widgets/ui/header/Header";
import { Outlet } from "react-router";

export const AppLayout = () => {
  useBarcodeScanner(); // global barcode listener
  return (
    <div className="h-[100vh] overflow-hidden bg-gray-50 py-2 px-3 flex flex-col gap-y-2">
      <Header />
      <Outlet />
    </div>
  );
};

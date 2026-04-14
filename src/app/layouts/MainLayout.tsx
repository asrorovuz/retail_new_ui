import { useBarcodeScanner } from "@/shared/lib/useBarcodeScanner";
import NavigateModal from "@/widgets/ui/navigate/NavigateModal";
import { useState } from "react";
import { Outlet } from "react-router";

export const AppLayout = () => {
    useBarcodeScanner(); // global barcode listener
    const [isOpenNavigate, setIsOpenNavigate] = useState(false);

    return (
        <div className="h-screen w-screen overflow-hidden p-3 bg-slate-200">
            <Outlet context={setIsOpenNavigate} />
            <NavigateModal
                isOpenNavigate={isOpenNavigate}
                setIsOpenNavigate={setIsOpenNavigate}
            />
        </div>
    );
};

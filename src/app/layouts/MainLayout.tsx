import { useBarcodeScanner } from "@/shared/lib/useBarcodeScanner";
import { useConnectionStatus } from "@/shared/lib/useConnectionStatus";
import { OfflineBanner } from "@/widgets/ui/offline-banner/OfflineBanner";
import NavigateModal from "@/widgets/ui/navigate/NavigateModal";
import { useState } from "react";
import { Outlet } from "react-router";

export const AppLayout = () => {
    useBarcodeScanner(); // global barcode listener
    useConnectionStatus(); // offline detector polling
    const [isOpenNavigate, setIsOpenNavigate] = useState(false);

    return (
        <>
            <OfflineBanner />
            <Outlet context={setIsOpenNavigate} />
            <NavigateModal
                isOpenNavigate={isOpenNavigate}
                setIsOpenNavigate={setIsOpenNavigate}
            />
        </>
    );
};

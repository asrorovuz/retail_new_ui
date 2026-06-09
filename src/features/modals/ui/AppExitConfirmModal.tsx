import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useCloseShiftApi } from "@/entities/init/repository";
import { useTranslation } from "react-i18next";

const AppExitConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const confirmedRef = useRef(false);
    const { activeShift, setActiveShift } = useSettingsStore();
    const { mutate: closeShift, isPending } = useCloseShiftApi();
    const { t } = useTranslation();

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (confirmedRef.current) return;
            e.preventDefault();
            e.returnValue = "";
            setIsOpen(true);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const handleConfirm = () => {
        if (activeShift) {
            const cashboxes_balance_closing = (activeShift.cashboxes_expected?.balances ?? []).map(
                (b) => ({ type: b.type, amount: b.amount, currency_code: b.currencyCode })
            );
            closeShift(
                { cashboxes_balance_closing },
                {
                    onSuccess: () => {
                        setActiveShift(null);
                        confirmedRef.current = true;
                        window.close();
                    },
                    onError: () => {
                        confirmedRef.current = true;
                        window.close();
                    },
                }
            );
        } else {
            confirmedRef.current = true;
            setIsOpen(false);
            window.close();
        }
    };

    const handleCancel = () => setIsOpen(false);

    return (
        <ConfirmDialog
            type="warning"
            width="50vw"
            isOpen={isOpen}
            title={t("alert.logoutTitle")}
            confirmText={isPending ? t("common.loading") : t("common.yes")}
            confirmButtonProps={{ disabled: isPending }}
            cancelText={t("common.cancel")}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onClose={handleCancel}
            onRequestClose={handleCancel}
        ><span className="text-xl">{t("alert.logoutContent")}</span></ConfirmDialog>
    );
};

export default AppExitConfirmModal;

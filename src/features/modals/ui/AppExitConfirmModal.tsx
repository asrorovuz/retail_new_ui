import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";

const AppExitConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const confirmedRef = useRef(false);

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
        confirmedRef.current = true;
        setIsOpen(false);
        window.close();
    };

    const handleCancel = () => setIsOpen(false);

    return (
        <ConfirmDialog
            type="warning"
            width="50vw"
            isOpen={isOpen}
            title="Выйти из программы?"
            confirmText="Да, выйти"
            cancelText="Отмена"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onClose={handleCancel}
            onRequestClose={handleCancel}
        ><span className="text-xl">Вы хотите выйти из программы?</span></ConfirmDialog>
    );
};

export default AppExitConfirmModal;

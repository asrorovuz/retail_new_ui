import { useEffect } from "react";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useCloseShiftApi, useInitialShiftCheckApi } from "@/entities/init/repository";

export const useShiftCheck = () => {
    const { user } = useAuthContext();
    const { setActiveShift, setPendingShiftOpen } = useSettingsStore();
    const { data: shift, isSuccess, isError } = useInitialShiftCheckApi();
    const { mutate: closeShift } = useCloseShiftApi();

    useEffect(() => {
        if (!isSuccess && !isError) return;

        // Holat A: Faol smena yo'q
        if (isError || !shift) {
            setActiveShift(null);
            setPendingShiftOpen(true);
            return;
        }

        // Holat B: Smena shu foydalanuvchiga tegishli
        if (shift.account.id === user?.id) {
            setActiveShift(shift);
            return;
        }

        // Holat C: Smena boshqa foydalanuvchiga tegishli — avtomatik yopish
        const cashboxes_balance_closing = (shift.cashboxes_expected?.balances ?? []).map(
            (b) => ({
                type: b.type,
                amount: b.amount,
                currency_code: b.currencyCode,
            })
        );

        closeShift(
            { cashboxes_balance_closing },
            {
                onSuccess: () => {
                    setActiveShift(null);
                    setPendingShiftOpen(true);
                },
                onError: () => {
                    setActiveShift(null);
                    setPendingShiftOpen(true);
                },
            }
        );
    }, [isSuccess, isError]);
};

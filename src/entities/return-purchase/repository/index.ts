import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerReturnPurchaseApi, updateReturnPurchaseApi } from "../api";
import type { RegisterReturnPurchaseModel } from "@/@types/return-purchase";

export const useUpdateReturnPurchaseApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: any }) =>
            updateReturnPurchaseApi(id, payload),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["history-return-purchase"] });
        },
    });
};

export const useRegisterReturnPurchaseApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterReturnPurchaseModel) =>
            registerReturnPurchaseApi(data),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["contragent"] });
        },
    });
};

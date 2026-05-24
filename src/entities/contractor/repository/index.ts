import { useMutation } from "@tanstack/react-query";
import { getActReport } from "../api";

export const useActReport = () => {
    return useMutation({
        mutationFn: ({ id, params }: any) => getActReport(id, params),
    });
};

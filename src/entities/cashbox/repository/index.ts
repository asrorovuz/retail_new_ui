import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCashExpenseApi,
  createCashInApi,
  createCashOutApi,
  deleteCashExpenseApi,
  deleteCashInApi,
  deleteCashOutApi,
  getCashboxIdApi,
  getCashExpense,
  getCashExpenseCount,
  getCashIn,
  getCashInCount,
  getCashOut,
  getCashOutCount,
  getOperationCategoryApi,
  updateCashExpenseApi,
  updateCashInApi,
  updateCashOutApi,
} from "../api";

export const useOperationCategoryApi = () => {
  return useQuery({
    queryKey: ["operation-category"],
    queryFn: getOperationCategoryApi,
  });
};

export const useCashboxByIdApi = (
  id: number | null,
  type: number,
  modalType: boolean
) => {
  return useQuery({
    queryKey: ["cashbox-id", id, type],
    queryFn: () => getCashboxIdApi(id, type),
    enabled: !!id && modalType,
  });
};

export const useCashInApi = (params: any, enabled: boolean) => {
  return useQuery({
    queryKey: ["cash-in", params, enabled],
    queryFn: () => getCashIn(params),
    enabled,
  });
};

export const useCashInCountApi = (params: any, enabled: boolean) => {
  return useQuery({
    queryKey: ["cash-in-count", params, enabled],
    queryFn: () => getCashInCount(params),
    enabled,
  });
};

export const useCashOutApi = (params: any, enabled: boolean) => {
  return useQuery({
    queryKey: ["cash-out", params, enabled],
    queryFn: () => getCashOut(params),
    enabled,
  });
};

export const useCashOutCountApi = (params: any, enabled: boolean) => {
  return useQuery({
    queryKey: ["cash-out-count", params, enabled],
    queryFn: () => getCashOutCount(params),
    enabled,
  });
};

export const useCashExpenseApi = (params: any, enabled: boolean) => {
  return useQuery({
    queryKey: ["cash-expense", params, enabled],
    queryFn: () => getCashExpense(params),
    enabled,
  });
};

export const useCashExpenseCountApi = (params: any, enabled: boolean) => {
  return useQuery({
    queryKey: ["cash-expense-count", params, enabled],
    queryFn: () => getCashExpenseCount(params),
    enabled,
  });
};

// CREATE
export const useCreateCashIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createCashInApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["cash-in"] });
      queryClient.invalidateQueries({ queryKey: ["cash-in-count"] });
    },
  });
};

export const useCreateCashOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createCashOutApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["cash-out"] });
      queryClient.invalidateQueries({ queryKey: ["cash-out-count"] });
    },
  });
};

export const useCreateCashExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createCashExpenseApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["cash-expense"] });
      queryClient.invalidateQueries({ queryKey: ["cash-expense-count"] });
    },
  });
};

// UPDATE
export const useUpdateCashIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) => updateCashInApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-in"] });
      queryClient.invalidateQueries({ queryKey: ["cash-in-count"] });
    },
  });
};

export const useUpdateCashOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) => updateCashOutApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-out"] });
      queryClient.invalidateQueries({ queryKey: ["cash-out-count"] });
    },
  });
};

export const useUpdateCashExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: any) => updateCashExpenseApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-expense"] });
      queryClient.invalidateQueries({ queryKey: ["cash-expense-count"] });
    },
  });
};

// DELETE
export const useDeleteCashIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: any) => deleteCashInApi(id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["cash-in"] });
      queryClient.invalidateQueries({ queryKey: ["cash-in-count"] });
    },
  });
};

export const useDeleteCashOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: any) => deleteCashOutApi(id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["cash-out"] });
      queryClient.invalidateQueries({ queryKey: ["cash-out-count"] });
    },
  });
};

export const useDeleteCashExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: any) => deleteCashExpenseApi(id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["cash-expense"] });
      queryClient.invalidateQueries({ queryKey: ["cash-expense-count"] });
    },
  });
};

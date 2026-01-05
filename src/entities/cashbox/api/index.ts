import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

export const getOperationCategoryApi = async (): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.getCashboxOperationsCategoy,
    method: "GET",
  });
};

export const getCashboxIdApi = async (
  id: number | null,
  type: number
): Promise<any> => {
  if (!id) return null;

  const urlMap: Record<number, string> = {
    1: pathServices.cashbox.getCashboxByIdCashIn,
    2: pathServices.cashbox.getCashboxByIdCashOut,
    3: pathServices.cashbox.getCashboxByIdExpense,
  };

  const url = urlMap[Number(type)];

  if (!url) {
    throw new Error("Noto‘g‘ri cashbox type");
  }

  return await apiRequest<any>({
    url: `${url}${id}`,
    method: "GET",
  });
};

export const getCashIn = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.getCashIn,
    method: "GET",
    params,
  });
};

export const getCashInCount = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.getCashInCount,
    method: "GET",
    params,
  });
};

export const getCashOut = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.getCashOut,
    method: "GET",
    params,
  });
};

export const getCashOutCount = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.getCashOutCount,
    method: "GET",
    params,
  });
};

export const getCashExpense = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.getCashExpense,
    method: "GET",
    params,
  });
};

export const getCashExpenseCount = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.getCashExpenseCount,
    method: "GET",
    params,
  });
};

// CREATE
export const createCashInApi = async (payload: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.createCashIn,
    method: "POST",
    data: payload,
  });
};

export const createCashOutApi = async (payload: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.createCashOut,
    method: "POST",
    data: payload,
  });
};

export const createCashExpenseApi = async (payload: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.createCashExpense,
    method: "POST",
    data: payload,
  });
};

// UPDATE
export const updateCashInApi = async (
  id: number,
  payload: any
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.updateCashIn + id,
    method: "POST",
    data: payload,
  });
};

export const updateCashOutApi = async (
  id: number,
  payload: any
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.updateCashOut + id,
    method: "POST",
    data: payload,
  });
};

export const updateCashExpenseApi = async (
  id: number,
  payload: any
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.updateCashExpense + id,
    method: "POST",
    data: payload,
  });
};

// DELETE
export const deleteCashInApi = async (id: number): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.deleteCashIn + id,
    method: "POST",
  });
};

export const deleteCashOutApi = async (id: number): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.deleteCashOut + id,
    method: "POST",
  });
};

export const deleteCashExpenseApi = async (id: number): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.cashbox.deleteCashExpense + id,
    method: "POST",
  });
};

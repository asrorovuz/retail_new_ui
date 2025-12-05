import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

// UPDATE
export const updateCashRegisterArca = async (
  payload: any,
  id: number | string
) => {
  console.log(id, payload, "555");

  return await apiRequest({
    method: "POST",
    data: payload,
    url: `${pathServices.fiscalized.updateCashRegisterArca}${id}`,
  });
};
export const updateCashRegisterSimurg = async (
  payload: any,
  id: number | string
) => {
  return await apiRequest({
    method: "POST",
    data: payload,
    url: `${pathServices.fiscalized.updateCashRegisterSimurg}${id}`,
  });
};
export const updateCashRegisterEPos = async (
  payload: any,
  id: number | string
) => {
  return await apiRequest({
    method: "POST",
    data: payload,
    url: `${pathServices.fiscalized.updateCashRegisterEPos}${id}`,
  });
};
export const updateCashRegisterHippoPos = async (
  payload: any,
  id: number | string
) => {
  return await apiRequest({
    method: "POST",
    data: payload,
    url: `${pathServices.fiscalized.updateCashRegisterHippoPos}${id}`,
  });
};

export const updatePaymentPayme = async (payload: any, id: number | string) => {
  return await apiRequest({
    method: "POST",
    data: payload,
    url: `${pathServices.paymentProvider.updatePaymentPay}${id}`,
  });
};
export const updatePaymentClick = async (payload: any, id: number | string) => {
  return await apiRequest({
    method: "POST",
    data: payload,
    url: `${pathServices.paymentProvider.updatePaymentClick}${id}`,
  });
};

export const updateSettings = async (payload: any) => {
  return await apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.settings.settingsUpdata,
  });
};

export const updateSettingsShift = async (payload: any) => {
  return await apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.settings.settingsShiftUpdat,
  });
};

// CREATE
export const postCashRegisterArca = async (payload: any) => {
  return apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.fiscalized.addCashRegisterArca,
  });
};
export const postCashRegisterSimurg = async (payload: any) => {
  return apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.fiscalized.addCashRegisterSimurg,
  });
};
export const postCashRegisterEPos = async (payload: any) => {
  return apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.fiscalized.addCashRegisterEPos,
  });
};
export const postCashRegisterHippoPos = async (payload: any) => {
  return apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.fiscalized.addCashRegisterHippoPos,
  });
};

export const postPayme = async (payload: any) => {
  return apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.paymentProvider.addPaymentPay,
  });
};
export const postClick = async (payload: any) => {
  return apiRequest({
    method: "POST",
    data: payload,
    url: pathServices.paymentProvider.addPaymentClick,
  });
};

// DELETE
export const deleteFiscalizedDevice = async (id: number): Promise<any> => {
  return await apiRequest<any>({
    url: `${pathServices.fiscalized.deleteFiscalized}${id}`,
    method: "POST",
  });
};

export const deletePaymentProvider = async (id: number): Promise<any> => {
  return await apiRequest<any>({
    url: `${pathServices.paymentProvider.deletePaymentProvider}${id}`,
    method: "POST",
  });
};

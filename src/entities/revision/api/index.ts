import type { RegisterType } from "@/@types/products";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

export const getRevisionApi = async (
  size?: number,
  index?: number,
  filterParams?: any,
): Promise<any> => {
  const skip = index && size ? (index - 1) * size : 0;
  return await apiRequest<any>({
    url: pathServices.revisions.getRevisionPath,
    method: "GET",
    params: {
      limit: size ?? 20,
      skip,
      ...filterParams,
    },
  });
};

export const getRevisionCountApi = async (
  size?: number,
  index?: number,
  filterParams?: any,
): Promise<any> => {
  const skip = index && size ? (index - 1) * size : 0;
  return await apiRequest<any>({
    url: pathServices.revisions.getRevisionCountPath,
    method: "GET",
    params: {
      limit: size ?? 20,
      skip,
      ...filterParams,
    },
  });
};

export const createRegisterApi = async (
  payload: RegisterType,
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.revisions.createRegister,
    method: "POST",
    data: payload,
  });
};


export const deleteRevisionApi = async (id: number | null): Promise<any> => {
  return await apiRequest<any>({
    url: `${pathServices.revisions.deleteRevisionPath}/${id}`,
    method: "POST",
  });
};

export const getWriteoffApi = async (
  size?: number,
  index?: number,
  filterParams?: any,
): Promise<any> => {
  const skip = index && size ? (index - 1) * size : 0;
  return await apiRequest<any>({
    url: pathServices.revisions.getWriteoffPath,
    method: "GET",
    params: {
      limit: size ?? 20,
      skip,
      ...filterParams,
    },
  });
};

export const getWriteoffCountApi = async (
  size?: number,
  index?: number,
  filterParams?: any,
): Promise<any> => {
  const skip = index && size ? (index - 1) * size : 0;
  return await apiRequest<any>({
    url: pathServices.revisions.getWriteoffCountPath,
    method: "GET",
    params: {
      limit: size ?? 20,
      skip,
      ...filterParams,
    },
  });
};

export const createWriteoffApi = async (
  payload: RegisterType,
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.revisions.createWriteoff,
    method: "POST",
    data: payload,
  });
};


export const deleteWriteoffApi = async (id: number | null): Promise<any> => {
  return await apiRequest<any>({
    url: `${pathServices.revisions.deleteWriteoffPath}/${id}`,
    method: "POST",
  });
};
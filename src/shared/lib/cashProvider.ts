import simurgImg from "@/app/assets/pos-terminals/Simurg.png";
import arcaImg from "@/app/assets/pos-terminals/arca.svg";

export const CashRegisterProviderTypeHippoPos = 1;
export const CashRegisterProviderTypeArca = 2;
export const CashRegisterProviderTypeSimurg = 3;
export const CashRegisterProviderTypeEPos = 4;

export const GetCashRegisterProviderName = (type: number) => {
  switch (type) {
    case CashRegisterProviderTypeArca:
      return "Arca";
    case CashRegisterProviderTypeHippoPos:
      return "HippoPos";
    case CashRegisterProviderTypeEPos:
      return "EPos";
    case CashRegisterProviderTypeSimurg:
      return "Simurg";
    default:
      return "";
  }
};

export const GetCashRegisterProviderLogo = (type: number) => {
  switch (type) {
    case CashRegisterProviderTypeArca:
      return arcaImg;
    case CashRegisterProviderTypeHippoPos:
      return "";
    case CashRegisterProviderTypeEPos:
      return "";
    case CashRegisterProviderTypeSimurg:
      return simurgImg;
    default:
      return "";
  }
};

const getCashRegisterProviderType = (type: number, name: string) => {
  return {
    type,
    name,
  };
};

export const CashRegisterProviderTypes = [
  getCashRegisterProviderType(
    CashRegisterProviderTypeArca,
    GetCashRegisterProviderName(CashRegisterProviderTypeArca)
  ),
  getCashRegisterProviderType(
    CashRegisterProviderTypeHippoPos,
    GetCashRegisterProviderName(CashRegisterProviderTypeHippoPos)
  ),
  getCashRegisterProviderType(
    CashRegisterProviderTypeEPos,
    GetCashRegisterProviderName(CashRegisterProviderTypeEPos)
  ),
  getCashRegisterProviderType(
    CashRegisterProviderTypeSimurg,
    GetCashRegisterProviderName(CashRegisterProviderTypeSimurg)
  ),
];

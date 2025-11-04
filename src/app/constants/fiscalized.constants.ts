import simurgImg from "@/app/assets/pos-terminals/Simurg.png";
import arcaImg from "@/app/assets/pos-terminals/arca.svg";

export const FiscalizedProviderTypeHippoPos = 1;
export const FiscalizedProviderTypeArca = 2;
export const FiscalizedProviderTypeSimurg = 3;
export const FiscalizedProviderTypeEPos = 4;

export const GetFiscalizedProviderName = (type: number) => {
  switch (type) {
    case FiscalizedProviderTypeArca:
      return "Arca";
    case FiscalizedProviderTypeHippoPos:
      return "HippoPos";
    case FiscalizedProviderTypeEPos:
      return "EPos";
    case FiscalizedProviderTypeSimurg:
      return "Simurg";
    default:
      return "";
  }
};

export const GetFiscalizedProviderLogo = (type: number) => {
  switch (type) {
    case FiscalizedProviderTypeArca:
      return arcaImg;
    case FiscalizedProviderTypeHippoPos:
      return "";
    case FiscalizedProviderTypeEPos:
      return "";
    case FiscalizedProviderTypeSimurg:
      return simurgImg;
    default:
      return "";
  }
};

const getFiscalizedProviderType = (type: number, name: string) => {
  return {
    type,
    name,
  };
};

export const FiscalizedProviderTypes = [
  getFiscalizedProviderType(
    FiscalizedProviderTypeArca,
    GetFiscalizedProviderName(FiscalizedProviderTypeArca)
  ),
  getFiscalizedProviderType(
    FiscalizedProviderTypeHippoPos,
    GetFiscalizedProviderName(FiscalizedProviderTypeHippoPos)
  ),
  getFiscalizedProviderType(
    FiscalizedProviderTypeEPos,
    GetFiscalizedProviderName(FiscalizedProviderTypeEPos)
  ),
  getFiscalizedProviderType(
    FiscalizedProviderTypeSimurg,
    GetFiscalizedProviderName(FiscalizedProviderTypeSimurg)
  ),
];

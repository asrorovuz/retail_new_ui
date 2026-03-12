import { lazy } from "react";

export const SalePage = lazy(() => import("@/pages/sale"));
export const RefundPage = lazy(() => import("@/pages/refund"));
export const ProductsPage = lazy(() => import("@/pages/products"));
export const LoginPage = lazy(() => import("@/pages/login/ui/LoginPage"));
export const RegisterPage = lazy(() => import("@/pages/login/ui/RegisterPage"));
export const PavouriteProductPage = lazy(
  () => import("@/pages/favoutite-product"),
);
export const SettingsPage = lazy(() => import("@/pages/settings"));
export const PurchasePricePage = lazy(() => import("@/pages/purchase"));
export const CashboxPage = lazy(() => import("@/pages/cashbox"));
export const CashboxOperations = lazy(
  () => import("@/pages/cashbox-operations"),
);

// history transaction
export const HistorySalePage = lazy(
  () => import("@/pages/history/ui/SaleHistory"),
);
export const HistoryRefundPage = lazy(
  () => import("@/pages/history/ui/RefundHistory"),
);
export const HistoryPurchasePage = lazy(
  () => import("@/pages/history/ui/PurchaseHistory"),
);

export const CounterpartyPage = lazy(() => import("@/pages/counterparty"));
export const RevisyaPage = lazy(() => import("@/pages/revisiya"));
export const RevisyaOperationPage = lazy(
  () => import("@/pages/revisiya/ui/RevisyaOperation"),
);
export const WriteOffPage = lazy(
  () => import("@/pages/write-off/WriteOffPage"),
);
export const WriteOffOperationPage = lazy(
  () => import("@/pages/write-off/WriteOffOperation"),
);
export const ReportPage = lazy(() => import("@/pages/report"));

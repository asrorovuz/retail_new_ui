import { lazy } from "react";

export const SalePage = lazy(() => import("@/pages/sale"));
export const RefundPage = lazy(() => import("@/pages/refund"));
export const ProductsPage = lazy(() => import("@/pages/products"));
// export const SettingsPage = lazy(() => import("@/pages/settings"));
export const HistoryCheckPage = lazy(() => import("@/pages/history-check"));
export const LoginPage = lazy(() => import("@/pages/login"))

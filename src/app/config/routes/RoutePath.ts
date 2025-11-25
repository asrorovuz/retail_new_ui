import { lazy } from "react";

export const SalePage = lazy(() => import("@/pages/sale"));
export const RefundPage = lazy(() => import("@/pages/refund"));
export const ProductsPage = lazy(() => import("@/pages/products"));
export const LoginPage = lazy(() => import("@/pages/login/ui/LoginPage"));
export const RegisterPage = lazy(() => import("@/pages/login/ui/RegisterPage"));
export const PavouriteProductPage = lazy(
  () => import("@/pages/favoutite-product")
);

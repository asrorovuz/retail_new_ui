import { Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { AppLayout } from "@/app/layouts/MainLayout";
import { InitProvider } from "@/app/providers";
import Loading from "@/shared/ui/loading";
import LoginPage from "@/pages/login/ui/LoginPage";
import { Register } from "@/features/auth";
import {
  SalePage,
  RefundPage,
  ProductsPage,
  PavouriteProductPage,
  SettingsPage,
  PurchasePricePage,
  CashboxPage,
  CashboxOperations,
  HistoryPage,
  HistorySalePage,
  HistoryRefundPage,
  HistoryPurchasePage,
} from "./RoutePath";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";

export const AppRouter = () => (
  <HashRouter>
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <Loading />
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route
            element={
              <InitProvider>
                <AppLayout />
              </InitProvider>
            }
          >
            <Route path="/sales" element={<SalePage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/purchase" element={<PurchasePricePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/favoutite-products"
              element={<PavouriteProductPage />}
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/cashbox" element={<CashboxPage />} />
            <Route
              path="/cashbox/cash-operation"
              element={<CashboxOperations />}
            />
            <Route path="/history" element={<HistoryPage />}>
              <Route path="/history/sales" element={<HistorySalePage />} />
              <Route path="/history/refund" element={<HistoryRefundPage />} />
              <Route
                path="/history/purchase"
                element={<HistoryPurchasePage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Default / fallback */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Suspense>
  </HashRouter>
);

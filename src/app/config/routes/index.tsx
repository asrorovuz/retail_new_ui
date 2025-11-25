import { Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { AppLayout } from "@/app/layouts/MainLayout";
import { InitProvider } from "@/app/providers";
import Loading from "@/shared/ui/loading";
import LoginPage from "@/pages/login/ui/LoginPage";
import { Register } from "@/features/auth";
import { SalePage, RefundPage, ProductsPage, PavouriteProductPage } from "./RoutePath";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";

export const AppRouter = () => (
  <HashRouter>
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route
          element={
            <Suspense fallback={<div className="flex items-center justify-center w-screen h-screen"><Loading /></div>}>
              <AuthLayout />
            </Suspense>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <Suspense fallback={<div className="flex items-center justify-center w-screen h-screen"><Loading /></div>}>
              <InitProvider>
                <AppLayout />
              </InitProvider>
            </Suspense>
          }
        >
          <Route path="/sales" element={<SalePage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/favoutite-products" element={<PavouriteProductPage />} />
        </Route>
      </Route>

      {/* Default / fallback */}
      <Route path="*" element={<Navigate to="/sales" replace />} />
    </Routes>
  </HashRouter>
);

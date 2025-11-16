import { createBrowserRouter, Navigate } from "react-router";
import {
  PavouriteProductPage,
  ProductsPage,
  RefundPage,
  SalePage,
} from "./RoutePath";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import LoginPage from "@/pages/login/ui/LoginPage";
import { InitProvider } from "@/app/providers";
import { AppLayout } from "@/app/layouts/MainLayout";
import { Suspense } from "react";
import Loading from "@/shared/ui/loading";
import { Register } from "@/features/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/sales" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<Loading />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<Loading />}>
            <InitProvider>
              <AppLayout />
            </InitProvider>
          </Suspense>
        ),
        children: [
          {
            path: "/sales",
            element: <SalePage />,
          },
          {
            path: "/refund",
            element: <RefundPage />,
          },
          {
            path: "/products",
            element: <ProductsPage />,
          },
          {
            path: "/favoutite-products",
            element: <PavouriteProductPage />,
          },
          // Boshqa routelar...
        ],
      },
    ],
  },
]);

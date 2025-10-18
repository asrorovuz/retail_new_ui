import { createBrowserRouter, Navigate } from "react-router";
import { HistoryCheckPage, ProductsPage, RefundPage, SalePage } from "./RoutePath";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import LoginPage from "@/pages/login/ui/LoginPage";
import { InitProvider } from "@/app/providers";
import { AppLayout } from "@/app/layouts/MainLayout";
import { Suspense } from "react";
import Loading from "@/shared/ui/loading";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/sales" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { 
            path: "/login", 
            element: (
              <Suspense fallback={<Loading />}>
                <LoginPage />
              </Suspense>
            )
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
            element: (
              <Suspense fallback={<Loading />}>
                <SalePage />
              </Suspense>
            )
          },
          { 
            path: "/refund", 
            element: (
              <Suspense fallback={<Loading />}>
                <RefundPage />
              </Suspense>
            )
          },
          { 
            path: "/products", 
            element: (
              <Suspense fallback={<Loading />}>
                <ProductsPage />
              </Suspense>
            )
          },
          // { 
          //   path: "/settings", 
          //   element: (
          //     <Suspense fallback={<Loading />}>
          //       <SettingsPage />
          //     </Suspense>
          //   )
          // },
          { 
            path: "/history-check", 
            element: (
              <Suspense fallback={<Loading />}>
                <HistoryCheckPage />
              </Suspense>
            )
          },
          // Boshqa routelar...
        ],
      },
    ],
  },
]);
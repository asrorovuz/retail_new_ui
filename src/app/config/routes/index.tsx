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
    HistorySalePage,
    HistoryRefundPage,
    HistoryPurchasePage,
    RevisyaPage,
    RevisyaOperationPage,
    WriteOffPage,
    WriteOffOperationPage,
    ReportPage,
    PeriodReport,
    AccountPage,
    CategoryPage,
    CashboxCategory,
    ContractorById,
    ReturnPurchaseOperation,
    ReturnPurchaseHistory,
} from "./RoutePath";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";
import Counterparty from "@/pages/counterparty";

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
                        <Route
                            path="/purchase"
                            element={<PurchasePricePage />}
                        />
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
                        <Route
                            path="/sales-history"
                            element={<HistorySalePage />}
                        />
                        <Route
                            path="/refund-history"
                            element={<HistoryRefundPage />}
                        />
                        <Route
                            path="/purchase-history"
                            element={<HistoryPurchasePage />}
                        />

                        <Route
                            path="/return-purchase"
                            element={<ReturnPurchaseOperation />}
                        />
                        <Route
                            path="/return-purchase-history"
                            element={<ReturnPurchaseHistory />}
                        />

                        <Route
                            path="/counterparties"
                            element={<Counterparty />}
                        ></Route>
                        <Route
                            path="/counterparties/:id"
                            element={<ContractorById />}
                        ></Route>
                        <Route path="/revisiya" element={<RevisyaPage />} />
                        <Route
                            path="/revisiya/operation"
                            element={<RevisyaOperationPage />}
                        />
                        <Route path="/writeoff" element={<WriteOffPage />} />
                        <Route
                            path="/writeoff/operation"
                            element={<WriteOffOperationPage />}
                        />
                        <Route path="/report" element={<ReportPage />} />
                        <Route path="/category" element={<CategoryPage />} />
                        <Route
                            path="/cashbox-category"
                            element={<CashboxCategory />}
                        />

                        <Route
                            path="/period-report"
                            element={<PeriodReport />}
                        />
                        <Route path="/account" element={<AccountPage />} />
                    </Route>
                </Route>

                {/* Default / fallback */}
                <Route path="*" element={<Navigate to="/register" replace />} />
            </Routes>
        </Suspense>
    </HashRouter>
);

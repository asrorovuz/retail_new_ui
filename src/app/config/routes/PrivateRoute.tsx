import { Navigate, Outlet } from "react-router";
import Loading from "@/shared/ui/loading";
import { useAuthContext } from "../../providers/AuthProvider";
import { Register } from "@/features/auth";

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <Loading />;

  // ✅ TO'G'RI: Faqat authentication tekshirish
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const isAstilectron =
    typeof window !== "undefined" && !!(window as any).astilectron;

  if (loading) return <Loading />;

  // ✅ Agar authenticated bo'lsa va Astilectron bo'lsa -> /sales ga
  // ✅ Agar authenticated bo'lsa lekin browser bo'lsa -> /register da qolsin
  if (isAuthenticated && isAstilectron) {
    return <Navigate to="/sales" replace />;
  }

  return <Outlet />;
};

export const RootRedirect = () => {
  try {
    const { isAuthenticated, loading } = useAuthContext();
    const isAstilectron =
      typeof window !== "undefined" && !!(window as any).astilectron;

    // Loading holati
    if (loading)
      return (
        <div className="flex items-center justify-center w-screen h-screen">
          <Loading />
        </div>
      );

    // Browser muhitida - DOIM /register
    if (!isAstilectron) {
      return <Navigate to="/register" replace />;
    }

    // Astilectron muhitida
    return <Navigate to={isAuthenticated ? "/sales" : "/login"} replace />;
  } catch (error) {
    // ✅ HAR QANDAY XATOLIKDA REGISTER KO'RSATISH
    return <Register />;
  }
};

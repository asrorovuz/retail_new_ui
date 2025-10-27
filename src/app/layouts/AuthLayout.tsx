import { Outlet, useNavigate } from "react-router";
import logoHippo from "@/app/assets/image.png";
import { useAuthStatus } from "@/entities/auth/repository";
import { useEffect } from "react";

export const AuthLayout = () => {
  const navigate = useNavigate();

  const { data } = useAuthStatus();

  useEffect(() => {
    if (data?.is_registered) navigate("/login");
    else navigate("/register");
  }, [data]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-200">
      <div className="w-[255px] mx-auto mb-10">
        <img className="w-full object-cover" src={logoHippo} alt="Hippo" />
      </div>
      <>
        <Outlet context={{ register_status: data?.is_registered ?? false }}/>
      </>
    </div>
  );
};

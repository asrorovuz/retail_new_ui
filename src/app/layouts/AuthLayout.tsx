import { Outlet, useNavigate } from "react-router";
import logoHippo from "@/app/assets/image.png";
import { useAuthStatus } from "@/entities/auth/repository";
import { useEffect } from "react";

export const AuthLayout = () => {
  const navigate = useNavigate();

  const { data, refetch } = useAuthStatus();

  useEffect(() => {
    if (data?.is_registered) navigate("/login");
    else navigate("/register");
  }, [data]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
      <div className="w-[255px] mx-auto mb-10">
        <img className="w-full object-cover" src={logoHippo} alt="Hippo" />
      </div>
      <>
        <Outlet context={{refetch, isRegistered: data?.is_registered}} />
      </>
    </div>
  );
};

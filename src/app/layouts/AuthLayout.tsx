import { Outlet } from "react-router";
import logoHippo from "@/app/assets/image.png";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-200">
      <div className="w-[255px] mx-auto mb-10">
        <img className="w-full object-cover" src={logoHippo} alt="Hippo" />
      </div>
      <>
        <Outlet />
      </>
    </div>
  );
};

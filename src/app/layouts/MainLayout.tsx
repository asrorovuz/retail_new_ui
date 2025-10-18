import Header from "@/widgets/header/ui/Header";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-200 p-6 flex flex-col gap-y-6">
      <Header />
      <Outlet />
    </div>
  );
};

import { Outlet } from "react-router-dom";

const History = () => {
  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh-100px)]">
      <Outlet />
    </div>
  );
};

export default History;

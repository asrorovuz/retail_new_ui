import { useAuthContext } from "@/app/providers/AuthProvider";
import { Button } from "@/shared/ui/kit";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import Menu from "@/shared/ui/kit/Menu/Menu";
import MenuItem from "@/shared/ui/kit/Menu/MenuItem";
import { LogoutSvg } from "@/shared/ui/svg/LogoutSvg";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const activeKey = location.pathname.replace("/", "") || "sales";
  const { logout } = useAuthContext();

  const handleSelect = (eventKey: string) => {
    navigate(eventKey);
  };

  return (
    <header className="bg-white rounded-3xl p-2 flex justify-between items-center">
      <Menu
        className="menu-horizontal"
        onSelect={handleSelect}
        menuItemHeight={40}
      >
        <MenuItem eventKey="sales">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[16px] transition-colors duration-200 ${
              activeKey === "sales"
                ? "text-blue-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Продажа</span>
          </div>
        </MenuItem>
        <MenuItem eventKey="refund">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[16px] transition-colors duration-200 ${
              activeKey === "refund"
                ? "text-blue-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Возврат</span>
          </div>
        </MenuItem>
        <MenuItem eventKey="products">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[16px] transition-colors duration-200 ${
              activeKey === "products"
                ? "text-blue-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Товары</span>
          </div>
        </MenuItem>
         <MenuItem eventKey="favoutite-products">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[16px] transition-colors duration-200 ${
              activeKey === "favoutite-products"
                ? "text-blue-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Фаворит товар</span>
          </div>
        </MenuItem>
        <MenuItem eventKey="history-check">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[16px] transition-colors duration-200 ${
              activeKey === "history-check"
                ? "text-blue-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>История чека</span>
          </div>
        </MenuItem>
      </Menu>

      <Button
        onClick={() => setShowAlert(true)}
        className="bg-red-100 text-red-500 text-base font-semibold active:bg-red-200 transition duration-300"
        variant="plain"
        icon={<LogoutSvg height={20} width={20} />}
      >
        Выход
      </Button>

      {showAlert && (
        <Alert
          type="warning"
          title="Выход из системы"
          content="Вы действительно хотите выйти из системы?"
          onCancel={() => setShowAlert(false)}
          onConfirm={() => {
            logout();
            setShowAlert(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;

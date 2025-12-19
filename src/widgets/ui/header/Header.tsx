import { useAuthContext } from "@/app/providers/AuthProvider";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useVersionStore } from "@/app/store/useVersionStore";
import { CreateShiftDialog, UpdateShiftDialog } from "@/features/shift";
import UpdateVersion from "@/features/update";
import { Button, Dropdown } from "@/shared/ui/kit";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import Menu from "@/shared/ui/kit/Menu/Menu";
import MenuItem from "@/shared/ui/kit/Menu/MenuItem";
import { LogoutSvg } from "@/shared/ui/svg/LogoutSvg";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiRefreshCcw } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [shiftAddModal, setShiftAddModal] = useState(false);
  const [shiftUpdateModal, setShiftUpdateModal] = useState(false);
  const navigate = useNavigate();

  const { activeShift } = useSettingsStore();
  const version = useVersionStore((store) => store.versions);

  const activeKey = location.pathname.replace("/", "") || "sales";
  const { logout } = useAuthContext();

  const handleSelect = (eventKey: string) => {
    navigate(eventKey);
  };

  return (
    <header className="bg-white rounded-2xl p-2 flex justify-between items-center">
      <Menu
        className="menu-horizontal"
        onSelect={handleSelect}
        menuItemHeight={40}
      >
        <MenuItem eventKey="sales">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
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
            className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
              activeKey === "refund"
                ? "text-red-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Возврат</span>
          </div>
        </MenuItem>
        <MenuItem eventKey="purchase">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
              activeKey === "purchase"
                ? "text-green-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Приход</span>
          </div>
        </MenuItem>
        <MenuItem eventKey="products">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
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
            className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
              activeKey === "favoutite-products"
                ? "text-blue-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Фаворит товар</span>
          </div>
        </MenuItem>
        <Dropdown renderTitle={<BsThreeDotsVertical color="#333" size={20} />}>
          <Dropdown.Item>
            <MenuItem eventKey="history/sales">
              <div
                className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
                  activeKey === "history/sales"
                    ? "text-blue-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>Продажа</span>
              </div>
            </MenuItem>
          </Dropdown.Item>
          <Dropdown.Item>
            <MenuItem eventKey="history/refund">
              <div
                className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
                  activeKey === "history/refund"
                    ? "text-red-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>Возврат</span>
              </div>
            </MenuItem>
          </Dropdown.Item>
          <Dropdown.Item>
            <MenuItem eventKey="history/purchase">
              <div
                className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
                  activeKey === "history/purchase"
                    ? "text-green-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>Приход</span>
              </div>
            </MenuItem>
          </Dropdown.Item>

          <Dropdown.Item>
            <MenuItem eventKey="settings">
              <div
                className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
                  activeKey === "settings"
                    ? "text-blue-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>Настройки</span>
              </div>
            </MenuItem>
          </Dropdown.Item>
          <Dropdown.Item>
            <MenuItem eventKey="cashbox">
              <div
                className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
                  activeKey === "cashbox"
                    ? "text-blue-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>Касса</span>
              </div>
            </MenuItem>
          </Dropdown.Item>
          <Dropdown.Item>
            <MenuItem eventKey="fiscalized">
              <div
                className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
                  activeKey === "fiscalized"
                    ? "text-blue-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>Фискализации</span>
              </div>
            </MenuItem>
          </Dropdown.Item>
          <Dropdown.Item>
            <MenuItem eventKey="payment-provider">
              <div
                className={`px-4 py-2 rounded-md cursor-pointer text-[14px] xl:text-[16px] transition-colors duration-200 ${
                  activeKey === "payment-provider"
                    ? "text-blue-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>Платёжные системы</span>
              </div>
            </MenuItem>
          </Dropdown.Item>
        </Dropdown>
      </Menu>

      <div className="flex items-center gap-x-2">
        {version && <div>В: {version || ""}</div>}
        <UpdateVersion />
        <div className="relative">
          <Button
            onClick={() =>
              activeShift ? setShiftUpdateModal(true) : setShiftAddModal(true)
            }
            className="!text-[14px] !xl:text-base !font-medium !xl:font-semibold"
            variant="solid"
            icon={<FiRefreshCcw />}
          >
            Смена
          </Button>
          {activeShift && (
            <span className="absolute -top-1 -right-1 block size-3 rounded-full bg-green-500 border border-white" />
          )}
        </div>
        <Button
          onClick={() => setShowAlert(true)}
          className="bg-red-100 text-red-500 text-[14px] xl:text-base font-semibold active:bg-red-200 active:text-red-500 hover:text-red-500 transition duration-300"
          variant="plain"
          icon={<LogoutSvg height={20} width={20} />}
        >
          Выход
        </Button>
      </div>

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

      <CreateShiftDialog
        isOpen={shiftAddModal}
        onClose={() => {
          setShiftUpdateModal(false);
          setShiftAddModal(false);
        }}
      />

      <UpdateShiftDialog
        isOpen={shiftUpdateModal}
        onClose={() => {
          setShiftUpdateModal(false);
          setShiftAddModal(false);
        }}
      />
    </header>
  );
};

export default Header;

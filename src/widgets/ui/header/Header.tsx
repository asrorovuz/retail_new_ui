import type { Shift } from "@/@types/shift/schema";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useVersionStore } from "@/app/store/useVersionStore";
import { useShiftApi } from "@/entities/init/repository";
import { CreateShiftDialog, UpdateShiftDialog } from "@/features/shift";
import UpdateVersion from "@/features/update";
import { Button, Dropdown } from "@/shared/ui/kit";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import Menu from "@/shared/ui/kit/Menu/Menu";
import MenuItem from "@/shared/ui/kit/Menu/MenuItem";
import { LogoutSvg } from "@/shared/ui/svg/LogoutSvg";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiRefreshCcw } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

interface ShiftError extends Error {
  active_shift_not_found?: boolean;
  response?: {
    data?: {
      active_shift_not_found?: boolean;
    };
  };
}

const Header = () => {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [shiftAddModal, setShiftAddModal] = useState(false);
  const [shiftUpdateModal, setShiftUpdateModal] = useState(false);
  const navigate = useNavigate();

  const { activeShift, setActiveShift } = useSettingsStore();
  const version = useVersionStore((store) => store.versions);

  const { data: shift, error } = useShiftApi() as {
    data: Shift | null;
    error: ShiftError | null;
  };

  const activeKey = location.pathname.replace("/", "") || "sales";
  const { logout } = useAuthContext();

  const handleSelect = (eventKey: string) => {
    navigate(eventKey);
  };

  useEffect(() => {
    if (shift) {
      setActiveShift(shift);
    } else if (
      error?.active_shift_not_found ||
      error?.response?.data?.active_shift_not_found
    ) {
      setActiveShift(null);
    }
  }, [shift, error]);

  return (
    <header className="bg-white rounded-3xl p-2 flex justify-between items-center">
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
            onClick={() => {
              if (activeShift) {
                setShiftUpdateModal(true);
              } else {
                setShiftAddModal(true);
              }
            }}
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

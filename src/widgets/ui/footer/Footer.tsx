import { useAuthContext } from "@/app/providers/AuthProvider";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useShiftApi } from "@/entities/init/repository";
import { CreateShiftDialog, UpdateShiftDialog } from "@/features/shift";
import { Button } from "@/shared/ui/kit";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import { LogoutSvg } from "@/shared/ui/svg/LogoutSvg";
import { useEffect, useState } from "react";
import { TfiReload } from "react-icons/tfi";
import { useOutletContext } from "react-router-dom";

const Footer = ({ deleteDraft, draft }: any) => {
  const [showAlert, setShowAlert] = useState(false);
  const [shiftAddModal, setShiftAddModal] = useState(false);
  const [shiftUpdateModal, setShiftUpdateModal] = useState(false);
  const { data, error } = useShiftApi(shiftAddModal || shiftUpdateModal);
  const { logout } = useAuthContext();
  const setIsOpenNavigate =
    useOutletContext<React.Dispatch<React.SetStateAction<boolean>>>();

  const { activeShift, setActiveShift } = useSettingsStore();

  const onDeleteActivedraft = () => {
    const findIndex = draft?.findIndex((item: any) => item?.isActive);
    deleteDraft(findIndex);
  };

  useEffect(() => {
    if (!!error) setActiveShift(null);
    else if (data) setActiveShift(data);
    else setActiveShift(null);
  }, [data, error, setActiveShift]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-x-2">
        <Button
          onClick={() => setShowAlert(true)}
          className="bg-red-100 h-8 text-red-500 text-xs font-semibold active:bg-red-200 active:text-red-500 hover:text-red-500 transition duration-300"
          variant="plain"
          size="sm"
          icon={<LogoutSvg height={20} width={20} />}
        >
          Выход
        </Button>
        <Button
          variant="default"
          type="button"
          size="sm"
          onClick={onDeleteActivedraft}
          className="!text-red-500 h-8 py-0 ring-0 hover:ring-0 active:ring-0 hover:border-red-500 active:border-red-500 active:text-red-600"
        >
          Удалить окно
        </Button>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          onClick={() => setIsOpenNavigate(true)}
          className="h-8 py-0"
          size="sm"
          type="button"
        >
          Другие
        </Button>
        <div className="relative">
          <Button
            className="h-8 py-0"
            size="sm"
            onClick={() =>
              activeShift ? setShiftUpdateModal(true) : setShiftAddModal(true)
            }
            icon={<TfiReload />}
            variant="solid"
            type="button"
          >
            Смена
          </Button>
          {activeShift && (
            <span className="absolute -top-1 -right-1 block size-3 rounded-full bg-green-500 border border-white" />
          )}
        </div>
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
    </div>
  );
};

export default Footer;

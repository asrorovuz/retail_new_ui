import { useAuthContext } from "@/app/providers/AuthProvider";
import { Button } from "@/shared/ui/kit";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import { LogoutSvg } from "@/shared/ui/svg/LogoutSvg";
import { useState } from "react";
import { TfiReload } from "react-icons/tfi";
import { useOutletContext } from "react-router-dom";

const Footer = ({ deleteDraft, draft }: any) => {
  const [showAlert, setShowAlert] = useState(false);
  const { logout } = useAuthContext();
  const setIsOpenNavigate =
    useOutletContext<React.Dispatch<React.SetStateAction<boolean>>>();

  const onDeleteActivedraft = () => {
    const findIndex = draft?.findIndex((item: any) => item?.isActive);
    deleteDraft(findIndex);
  };

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
        <Button
          className="h-8 py-0"
          size="sm"
          icon={<TfiReload />}
          variant="solid"
          type="button"
        >
          Смена
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
    </div>
  );
};

export default Footer;

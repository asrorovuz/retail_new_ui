import { Dialog } from "@/shared/ui/kit";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";
import { SlBasket } from "react-icons/sl";
import { useEffect } from "react";

const NavigateModal = ({ isOpenNavigate, setIsOpenNavigate }: any) => {
  const location = useLocation();
  const onClose = () => setIsOpenNavigate(false);

  useEffect(() => {
    if(isOpenNavigate){
        setIsOpenNavigate(false);
    }
  }, [location.pathname]);

  return (
    <Dialog width={"90vw"} isOpen={isOpenNavigate} onClose={onClose}>
      <div className="grid grid-cols-5 gap-5">
        <Link
          className="text-sm font-medium py-4 flex justify-center items-center gap-x-1 bg-slate-200 text-slate-800 rounded-lg"
          to={"/sales"}
        >
          <span>
            <SlBasket size={20} />
          </span>
          Продажа
        </Link>
        <Link
          className="text-sm font-medium py-4 flex justify-center items-center gap-x-1 bg-slate-200 text-slate-800 rounded-lg"
          to={"/refund"}
        >
          Возврат
        </Link>
        <Link
          className="text-sm font-medium py-4 flex justify-center items-center gap-x-1 bg-slate-200 text-slate-800 rounded-lg"
          to={"/purchase"}
        >
          Приход
        </Link>
        <Link
          className="text-sm font-medium py-4 flex justify-center items-center gap-x-1 bg-slate-200 text-slate-800 rounded-lg"
          to={"/products"}
        >
          Товары
        </Link>
        <Link
          className="text-sm font-medium py-4 flex justify-center items-center gap-x-1 bg-slate-200 text-slate-800 rounded-lg"
          to={"/favoutite-products"}
        >
          Фаворит товар
        </Link>
        <Link
          className="text-sm font-medium py-4 flex justify-center items-center gap-x-1 bg-slate-200 text-slate-800 rounded-lg"
          to={"/settings"}
        >
          <span>
            <MdOutlineSettings size={20} />
          </span>
          Настройки
        </Link>
      </div>
    </Dialog>
  );
};

export default NavigateModal;

import { Dialog } from "@/shared/ui/kit";
import { Link, useLocation } from "react-router-dom";
import {
  MdOutlineAssignmentReturn,
  MdOutlineInventory2,
  MdOutlineSettings,
  MdOutlineShoppingCart,
  MdOutlineStarBorder,
  MdOutlinePointOfSale,
  MdOutlinePeopleOutline,
  MdAssignment,
  MdBarChart,
} from "react-icons/md";
import { useEffect } from "react";

const NavigateModal = ({ isOpenNavigate, setIsOpenNavigate }: any) => {
  const location = useLocation();
  const onClose = () => setIsOpenNavigate(false);

  useEffect(() => {
    if (isOpenNavigate) {
      setIsOpenNavigate(false);
    }
  }, [location.pathname]);

  const linkClass =
    "text-sm font-medium py-4 flex justify-center items-center gap-x-2 bg-slate-200 hover:bg-slate-300 transition text-slate-800 rounded-lg";

  return (
    <Dialog
      onRequestClose={onClose}
      width={"90vw"}
      isOpen={isOpenNavigate}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <Link className={linkClass} to={"/sales"}>
          <MdOutlinePointOfSale size={20} />
          Продажи
        </Link>

        <Link className={linkClass} to={"/refund"}>
          <MdOutlineAssignmentReturn size={20} />
          Возвраты
        </Link>

        <Link className={linkClass} to={"/purchase"}>
          <MdOutlineInventory2 size={20} />
          Поступления
        </Link>

        <Link className={linkClass} to={"/products"}>
          <MdOutlineShoppingCart size={20} />
          Товары
        </Link>

        <Link className={linkClass} to={"/favoutite-products"}>
          <MdOutlineStarBorder size={20} />
          Избранные товары
        </Link>

        {/* <Link className={linkClass} to={"/sales-history"}>
          <MdOutlineHistory size={20} />
          История продаж
        </Link>

        <Link className={linkClass} to={"/purchase-history"}>
          <MdOutlineHistory size={20} />
          История поступлений
        </Link>

        <Link className={linkClass} to={"/refund-history"}>
          <MdOutlineHistory size={20} />
          История возвратов
        </Link> */}

        <Link className={linkClass} to={"/counterparties"}>
          <MdOutlinePeopleOutline size={20} />
          Контрагенты
        </Link>

        <Link className={linkClass} to={"/revisiya/operation"}>
          <MdAssignment size={20} />
          Ревизия
        </Link>

        <Link className={linkClass} to={"/report"}>
          <MdBarChart size={20} />
          Отчёт
        </Link>

        <Link className={linkClass} to={"/period-report"}>
          <MdBarChart size={20} />
          Отчет за период
        </Link>

        <Link className={linkClass} to={"/settings"}>
          <MdOutlineSettings size={20} />
          Настройки
        </Link>
      </div>
    </Dialog>
  );
};

export default NavigateModal;

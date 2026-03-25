import { Dialog } from "@/shared/ui/kit";
import { Link } from "react-router-dom";
import {
    MdOutlineAssignmentReturn,
    MdOutlineInventory2,
    MdOutlineSettings,
    MdOutlineShoppingCart,
    MdOutlineStarBorder,
    MdOutlinePointOfSale,
    MdOutlinePeopleOutline,
    MdAssignment,
} from "react-icons/md";

const NavigateModal = ({ isOpenNavigate, setIsOpenNavigate }: any) => {
    const onClose = () => setIsOpenNavigate(false);

    const linkClass =
        "text-sm font-medium py-4 flex justify-center items-center gap-x-2 bg-slate-200 hover:bg-slate-300 transition text-slate-800 rounded-lg";

    const NavItem = ({ to, icon, children }: any) => (
        <Link className={linkClass} to={to} onClick={onClose}>
            {icon}
            {children}
        </Link>
    );

    return (
        <Dialog
            onRequestClose={onClose}
            width={"90vw"}
            isOpen={isOpenNavigate}
            onClose={onClose}
        >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <NavItem className={linkClass} to={"/sales"}>
                    <MdOutlinePointOfSale size={20} />
                    Продажи
                </NavItem>

                <NavItem className={linkClass} to={"/refund"}>
                    <MdOutlineAssignmentReturn size={20} />
                    Возвраты
                </NavItem>

                <NavItem className={linkClass} to={"/purchase"}>
                    <MdOutlineInventory2 size={20} />
                    Поступления
                </NavItem>

                <NavItem className={linkClass} to={"/products"}>
                    <MdOutlineShoppingCart size={20} />
                    Товары
                </NavItem>

                <NavItem className={linkClass} to={"/favoutite-products"}>
                    <MdOutlineStarBorder size={20} />
                    Избранные товары
                </NavItem>

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

                <NavItem className={linkClass} to={"/counterparties"}>
                    <MdOutlinePeopleOutline size={20} />
                    Контрагенты
                </NavItem>

                <NavItem className={linkClass} to={"/revisiya/operation"}>
                    <MdAssignment size={20} />
                    Ревизия
                </NavItem>

                {/* <NavItem className={linkClass} to={"/report"}>
          <MdBarChart size={20} />
          Отчёт
        </NavItem> */}

                {/* <NavItem className={linkClass} to={"/period-report"}>
          <MdBarChart size={20} />
          Отчет за период
        </NavItem> */}

                <NavItem className={linkClass} to={"/settings"}>
                    <MdOutlineSettings size={20} />
                    Настройки
                </NavItem>
            </div>
        </Dialog>
    );
};

export default NavigateModal;

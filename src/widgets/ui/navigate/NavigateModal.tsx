import { Dialog } from "@/shared/ui/kit";
import { Link } from "react-router-dom";
import {
    MdOutlineAssignmentReturn,
    MdOutlineInventory2,
    MdOutlineShoppingCart,
    MdOutlineStarBorder,
    MdOutlinePointOfSale,
    MdOutlinePeopleOutline,
    MdAssignment,
    MdBarChart,
    MdAccountCircle,
} from "react-icons/md";
import { AccountPermissions } from "@/app/constants/permissions";
import { useCheckPermission } from "@/shared/lib/checkPermission";
import { TbCategoryPlus } from "react-icons/tb";

const NavigateModal = ({ isOpenNavigate, setIsOpenNavigate }: any) => {
    const onClose = () => setIsOpenNavigate(false);
    const checkPermission = useCheckPermission();

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 uppercase">
                <div className="flex flex-col gap-y-5">
                    <NavItem className={linkClass} to={"/sales"}>
                        <MdOutlinePointOfSale size={20} />
                        ПРОДАЖА
                    </NavItem>

                    {checkPermission(
                        AccountPermissions.AccountPermissionRefundView,
                    ) && (
                        <NavItem className={linkClass} to={"/refund"}>
                            <MdOutlineAssignmentReturn size={20} />
                            ВОЗВРАТ
                        </NavItem>
                    )}

                    {checkPermission(
                        AccountPermissions.AccountPermissionPurchaseView,
                    ) && (
                        <NavItem className={linkClass} to={"/purchase"}>
                            <MdOutlineInventory2 size={20} />
                            ПРИХОД
                        </NavItem>
                    )}
                    {checkPermission(
                        AccountPermissions.AccountPermissionRevisionView,
                    ) && (
                        <NavItem
                            className={linkClass}
                            to={"/revisiya/operation"}
                        >
                            <MdAssignment size={20} />
                            РЕВИЗИЯ
                        </NavItem>
                    )}

                    <NavItem className={linkClass} to={"/writeoff/operation"}>
                        <MdAssignment size={20} />
                        СПИСАНИЯ
                    </NavItem>
                </div>

                <div className="flex flex-col gap-y-5">
                    {checkPermission(
                        AccountPermissions.AccountPermissionProductView,
                    ) && (
                        <NavItem className={linkClass} to={"/products"}>
                            <MdOutlineShoppingCart size={20} />
                            ТОВАРЫ
                        </NavItem>
                    )}

                    <NavItem className={linkClass} to={"/favoutite-products"}>
                        <MdOutlineStarBorder size={20} />
                        ИЗБРАННЫЕ ТОВАРЫ
                    </NavItem>
                    <NavItem className={linkClass} to={"/category"}>
                        <TbCategoryPlus size={20} />
                        КАТЕГОРИИ
                    </NavItem>
                </div>

                <div className="flex flex-col gap-y-5">
                    {checkPermission(
                        AccountPermissions.AccountPermissionContractorView,
                    ) && (
                        <NavItem className={linkClass} to={"/counterparties"}>
                            <MdOutlinePeopleOutline size={20} />
                            КОНТРАГЕНТЫ
                        </NavItem>
                    )}
                    {checkPermission(
                        AccountPermissions.AccountPermissionCashBoxView,
                    ) && (
                        <NavItem className={linkClass} to={"/cashbox"}>
                            <MdOutlinePointOfSale size={20} />
                            КАССА
                        </NavItem>
                    )}
                    <NavItem className={linkClass} to={"/period-report"}>
                        <MdBarChart size={20} />
                        Отчёт за период
                    </NavItem>
                </div>
                <div className="flex flex-col gap-y-5">
                    <NavItem className={linkClass} to={"/account"}>
                        <MdAccountCircle size={20} />
                        Аккаунт
                    </NavItem>
                    
                </div>
            </div>
        </Dialog>
    );
};

export default NavigateModal;

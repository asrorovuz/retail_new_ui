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
    MdSchedule,
} from "react-icons/md";
import { AccountPermissions } from "@/app/constants/permissions";
import { useCheckPermission } from "@/shared/lib/checkPermission";
import { TbCategoryPlus } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const NavigateModal = ({ isOpenNavigate, setIsOpenNavigate }: any) => {
    const onClose = () => setIsOpenNavigate(false);
    const checkPermission = useCheckPermission();
    const { t } = useTranslation();

    const linkClass =
        "text-xs font-medium py-4 flex justify-center items-center gap-x-2 bg-slate-200 hover:bg-slate-300 transition text-slate-800 rounded-lg";

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
                <div className="flex flex-col gap-y-4">
                    <NavItem className={linkClass} to={"/sales"}>
                        <MdOutlinePointOfSale size={20} />
                        {t("nav.sale")}
                    </NavItem>

                    {checkPermission(
                        AccountPermissions.AccountPermissionRefundView,
                    ) && (
                        <NavItem className={linkClass} to={"/refund"}>
                            <MdOutlineAssignmentReturn size={20} />
                            {t("nav.refund")}
                        </NavItem>
                    )}

                    {checkPermission(
                        AccountPermissions.AccountPermissionPurchaseView,
                    ) && (
                        <NavItem className={linkClass} to={"/purchase"}>
                            <MdOutlineInventory2 size={20} />
                            {t("nav.purchase")}
                        </NavItem>
                    )}
                    <NavItem className={linkClass} to={"/return-purchase"}>
                        <MdOutlineAssignmentReturn size={20} />
                        {t("nav.returnToSupplier")}
                    </NavItem>

                    {checkPermission(
                        AccountPermissions.AccountPermissionRevisionView,
                    ) && (
                        <NavItem
                            className={linkClass}
                            to={"/revisiya/operation"}
                        >
                            <MdAssignment size={20} />
                            {t("nav.revision")}
                        </NavItem>
                    )}

                    <NavItem className={linkClass} to={"/writeoff/operation"}>
                        <MdAssignment size={20} />
                        {t("nav.writeOff")}
                    </NavItem>
                </div>

                <div className="flex flex-col gap-y-5">
                    {checkPermission(
                        AccountPermissions.AccountPermissionProductView,
                    ) && (
                        <NavItem className={linkClass} to={"/products"}>
                            <MdOutlineShoppingCart size={20} />
                            {t("nav.products")}
                        </NavItem>
                    )}

                    <NavItem className={linkClass} to={"/favoutite-products"}>
                        <MdOutlineStarBorder size={20} />
                        {t("nav.favourites")}
                    </NavItem>
                    <NavItem className={linkClass} to={"/category"}>
                        <TbCategoryPlus size={20} />
                        {t("nav.categories")}
                    </NavItem>
                    <NavItem className={linkClass} to={"/cashbox-category"}>
                        <TbCategoryPlus size={20} />
                        {t("nav.cashboxHistory")}
                    </NavItem>
                </div>

                <div className="flex flex-col gap-y-5">
                    {checkPermission(
                        AccountPermissions.AccountPermissionContractorView,
                    ) && (
                        <NavItem className={linkClass} to={"/counterparties"}>
                            <MdOutlinePeopleOutline size={20} />
                            {t("nav.counterparties")}
                        </NavItem>
                    )}
                    {checkPermission(
                        AccountPermissions.AccountPermissionCashBoxView,
                    ) && (
                        <NavItem className={linkClass} to={"/cashbox"}>
                            <MdOutlinePointOfSale size={20} />
                            {t("nav.cashbox")}
                        </NavItem>
                    )}
                    <NavItem className={linkClass} to={"/period-report"}>
                        <MdBarChart size={20} />
                        {t("nav.periodReport")}
                    </NavItem>
                </div>
                <div className="flex flex-col gap-y-5">
                    <NavItem className={linkClass} to={"/account"}>
                        <MdAccountCircle size={20} />
                        {t("nav.account")}
                    </NavItem>
                    <NavItem className={linkClass} to={"/smena"}>
                        <MdSchedule size={20} />
                        {t("nav.shift")}
                    </NavItem>
                </div>
            </div>
        </Dialog>
    );
};

export default NavigateModal;

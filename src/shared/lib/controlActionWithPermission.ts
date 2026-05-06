import { AccountPermissions } from "@/app/constants/permissions";
import { useCheckPermission } from "./checkPermission";

export const usePermission = () => {
    const checkPermission = useCheckPermission();

    const permissionMap = {
        sale: {
            create: AccountPermissions.AccountPermissionSaleCreate,
            update: AccountPermissions.AccountPermissionSaleUpdate,
            delete: AccountPermissions.AccountPermissionSaleDelete,
            view: AccountPermissions.AccountPermissionSaleView,
        },
        refund: {
            create: AccountPermissions.AccountPermissionRefundCreate,
            update: AccountPermissions.AccountPermissionRefundUpdate,
            delete: AccountPermissions.AccountPermissionRefundDelete,
            view: AccountPermissions.AccountPermissionRefundView,
        },
        purchase: {
            create: AccountPermissions.AccountPermissionPurchaseCreate,
            update: AccountPermissions.AccountPermissionPurchaseUpdate,
            delete: AccountPermissions.AccountPermissionPurchaseDelete,
            view: AccountPermissions.AccountPermissionPurchaseView,
        },
        revision: {
            create: AccountPermissions.AccountPermissionRevisionCreate,
            update: AccountPermissions.AccountPermissionRevisionUpdate,
            delete: AccountPermissions.AccountPermissionRevisionDelete,
            view: AccountPermissions.AccountPermissionRevisionView,
        },
        cashIn: {
            create: AccountPermissions.AccountPermissionCashBoxCashInCreate,
            update: AccountPermissions.AccountPermissionCashBoxCashInUpdate,
            delete: AccountPermissions.AccountPermissionCashBoxCashInDelete,
            view: AccountPermissions.AccountPermissionCashBoxCashInView,
        },
        cashOut: {
            create: AccountPermissions.AccountPermissionCashBoxCashOutCreate,
            update: AccountPermissions.AccountPermissionCashBoxCashOutUpdate,
            delete: AccountPermissions.AccountPermissionCashBoxCashOutDelete,
            view: AccountPermissions.AccountPermissionCashBoxCashOutView,
        },
        cashExpense: {
            create: AccountPermissions.AccountPermissionCashBoxExpenseCreate,
            update: AccountPermissions.AccountPermissionCashBoxExpenseUpdate,
            delete: AccountPermissions.AccountPermissionCashBoxExpenseDelete,
            view: AccountPermissions.AccountPermissionCashBoxExpenseView,
        },
    };

    const checkPermissionByAction = (
        type: "sale" | "refund" | "purchase" | "revision" | "cashIn" | "cashOut" | "cashExpense",
        action: "update" | "delete" | "view" | "create"
    ) => {
        const permission = permissionMap[type]?.[action];
        return permission ? checkPermission(permission) : true;
    };

    return { checkPermissionByAction };
};
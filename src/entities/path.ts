export const pathServices = {
    auth: {
        auth: "/public/auth/status",
        login: "/public/auth/login",
        confirmCode: "/public/auth/confirmation-code",
        globalLogin: "/public/auth/global-login",
        register: "/public/auth/register",
        contractor: "/api/contractor/create",
        deleteContractor: "/api/contractor/delete/",
        updateContractor: "/api/contractor/update/",
        registeration: "/public/auth/register-account",
        registerOrgPath: "/public/auth/register-organization",
        registerOrgLocalPath: "/public/auth/register-organization-local",
        resetPass: "/public/auth/reset-password",
        getAllAccounts: "/admin/auth/accounts/get",
        updatePassword: "/admin/auth/change-account-password/",
        createAccount: "/admin/auth/add-account",
        deleteAccount: "/admin/auth/delete-account/",
        updatePermission: "/admin/auth/account-permissions",
    },

    init: {
        printPath: "/api/print/",
        lastShiftPath: "/api/shift/last-active/get?cash_box_id=",
        shiftOpenApi: "/api/shift/open",
        getShiftPath: "/api/shift/active/get",
        getShiftoperation: "/api/shift/operation/get/",
        closeShiftPath: "/api/shift/close",
    },

    settings: {
        // GET
        getSettingsPath: `/api/settings/organization/get`,
        getPrinterName: `/api/print/printers/get`,

        // UPDATE
        settingsUpdata: "/api/settings/organization/update",
        // settingsShiftUpdat: "/api/settings/organization/shift/update",

        // TELEGRAM BOT
        getAllBot: "/api/bot/get",
        getAllConfig: "/api/bot/config/get",
        addBot: "/api/bot/register",
        sendContacts: "/api/bot/config/update",
        deleteBot: `/api/bot/delete/`,
        permissionPat: "/public/auth/account-permissions/",
    },

    warhouse: {
        getList: "/api/warehouse/get",
    },

    cashbox: {
        getAllCashbox: "/api/cash-box/get",
        getCashboxByIdCashIn: "/api/cash-box/cash-in/",
        getCashboxByIdCashOut: "/api/cash-box/cash-out/",
        getCashboxByIdExpense: "/api/cash-box/expense/",
        getCashIn: "/api/cash-box/cash-ins/get",
        getCashOut: "/api/cash-box/cash-outs/get",
        getCashExpense: "/api/cash-box/expenses/get",
        getCashInCount: "/api/cash-box/cash-ins/count/get",
        getCashOutCount: "/api/cash-box/cash-outs/count/get",
        getCashExpenseCount: "/api/cash-box/expenses/count/get",
        // CREATE
        createCashIn: "/api/cash-box/cash-in/create",
        createCashOut: "/api/cash-box/cash-out/create",
        createCashExpense: "/api/cash-box/expense/create",

        // UPDATE
        updateCashIn: "/api/cash-box/cash-in/update/",
        updateCashOut: "/api/cash-box/cash-out/update/",
        updateCashExpense: "/api/cash-box/expense/update/",

        // DELETE
        deleteCashIn: "/api/cash-box/cash-in/delete/",
        deleteCashOut: "/api/cash-box/cash-out/delete/",
        deleteCashExpense: "/api/cash-box/expense/delete/",
    },

    products: {
        // GET
        getAllProductsPath: "/api/product/get",
        getAllInfoProductsPath: "/api/product/stock/summary",
        getByIdPath: "/api/product/",
        getAllProductsCountPath: "/api/product/get/count",
        getTableSettingsPath: "/api/settings/account/get",
        getPriceTypesList: "/api/product/price-type/get",
        getCurrencyPath: "/api/currency/get",

        catalogSearch: "/api/product/catalog/search",
        getFavoritProduct: "/api/favorite-product/get/all",
        findByBarcode: `/api/product/find-by-barcode/`,
        findByBarcodeProduct:
            "/api/product/product-dictionary/find-by-barcode/",
        exportProductScale: `/api/product-export`,
        updateProductCatalogCode: "/api/product/catalog/update",

        //UPDATE
        updateTableSettingsPath:
            "/api/settings/account/product/data-table/column/update",
        updateAlertOn: "/api/warehouse/update/alert-on",
        updateProduct: "/api/product/update/",

        // CREATE
        createProductPath: "/api/product/create",
        createFavouriteProductPath: "/api/favorite-product/add",
        createExcelFileProduct: `/api/excel/parse`,
        exportExcelFileProduct: `/api/excel/products`,

        // DELETE
        deleteProductPath: `/api/product/delete`,
        deleteFavoritProductPath: "/api/favorite-product/delete",
    },

    categories: {
        getCategory: `/api/product/product-category/get`,
        getCategoryTree: `/api/product/product-category-tree/get`,
        getCashboxCategory: "/api/cash-box/operation-category/get",

        deleteCategoryPath: "/api/product/product-category/delete",
        deleteCashboxCategory: "/api/cash-box/operation-category/delete",

        addCategory: `/api/product/product-category/create`,
        addCashboxCategory: "/api/cash-box/operation-category/create",

        updateCategory: `/api/product/product-category/update/`,
        updateCashboxCategory: "/api/cash-box/operation-category/update/"
    },

    sale: {
        // GET
        register: "/api/sale/register",
        getFiscaldevice: "/api/fiscal-device/get",
        getPaymentPath: "/api/payment-provider/get",
        getContractorPath: "/api/contractor/get",
        updateSellPath: "/api/sale/update/",
        getPaymentDebts: "/api/payment/register",
        getPayoutDebts: "/api/payout/register",

        // CREATE
        createFiscalized: "/api/fiscalization/sale/register",
    },

    refund: {
        getCheck: "/api/sale/get-by-receipt",
        register: "/api/refund/register",
        updateRefundPath: "/api/refund/update/",
    },

    purchase: {
        // GET
        getContractorProductsById: "/api/contractor/products/",
        register: "/api/purchase/register",
        registerProduct: "/api/contractor/product/create",
        deleteContractorProduct: "/api/contractor/product/delete/",
        updatePurchasePath: "/api/purchase/update/",
        updatePurchasePricePath: "/api/warehouse-item/update-purchase-price",
        updateOtherPurchasePricePath: "/api/product/price/update/",
    },

    versions: {
        getVersions: "/api/auto-updater/current-version/get",
    },

    fiscalized: {
        getPrintFiscalXReport: "/api/fiscalization/x-report/print/",
        getOpenZReport: "/api/fiscalization/z-report/open/",
        getCloseZReport: "/api/fiscalization/z-report/close/",
        getSyncReport: "/api/fiscalization/sync-state/",

        // UPDATE
        updateCashRegisterArca: `/api/fiscal-device/arca/update/`,
        updateCashRegisterSimurg: `/api/fiscal-device/simurg/update/`,
        updateCashRegisterHippoPos: `/api/fiscal-device/hippo-pos/update/`,
        updateCashRegisterHippoPos4: `/api/fiscal-device/hippo-pos-applet4/update/`,
        updateCashRegisterEPos: `/api/fiscal-device/e-pos/update/`,

        // CREATE
        addCashRegisterArca: `/api/fiscal-device/arca/add`,
        addCashRegisterSimurg: `/api/fiscal-device/simurg/add`,
        addCashRegisterHippoPos: `/api/fiscal-device/hippo-pos/add`,
        addCashRegisterHippoPos4: `/api/fiscal-device/hippo-pos-applet4/add`,
        addCashRegisterEPos: `/api/fiscal-device/e-pos/add`,

        // DELETE
        deleteFiscalized: "/api/fiscal-device/delete/",
    },

    paymentProvider: {
        // UPDATE
        updatePaymentPay: "/api/payment-provider/payme/update/",
        updatePaymentClick: "/api/payment-provider/click/update/",

        // CREATE
        addPaymentPay: `/api/payment-provider/payme/add`,
        addPaymentClick: `/api/payment-provider/click/add`,

        //DELETE
        deletePaymentProvider: "/api/payment-provider/delete/",
    },

    history: {
        sellTransferPath: "/api/report/period/get",
        getEmployePath: "/api/employee/get",
        getContragentPath: "/api/contractor/get",
        getSellPath: "/api/sale/get",
        getSellIdPath: "/api/sale/",
        getRefundPath: "/api/refund/get",
        getRefundIdPath: "/api/refund/",
        getPurchasePath: "/api/purchase/get",
        getPurchaseIdPath: "/api/purchase/",

        // DELETE
        deleteSalePath: "/api/sale/delete/",
        deleteRefundPath: "/api/refund/delete/",
        deletePurchasePath: "/api/purchase/delete/",
    },

    revisions: {
        getRevisionPath: "/api/revision/get",
        getRevisionCountPath: "/api/revision/get/count",
        createRegister: "/api/revision/register",
        deleteRevisionPath: "/api/revision/delete",
        getWriteoffPath: "/api/write-off/get",
        getWriteoffCountPath: "/api/write-off/get/count",
        createWriteoff: "/api/write-off/register",
        deleteWriteoffPath: "/api/write-off/delete",
    },
};

export const pathServices = {
  auth: {
    auth: "/public/auth/status",
    login: "/public/auth/login",
    globalLogin: "/public/auth/global-login",
    register: "/public/auth/register",
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
    settingsShiftUpdat: "/api/settings/organization/shift/update",
  },

  warhouse: {
    getList: "/api/warehouse/get",
  },

  cashbox: {
    getAllCashbox: "/api/cash-box/get",
    getCashboxByIdCashIn: "/api/cash-box/cash-in/",
    getCashboxByIdCashOut: "/api/cash-box/cash-out/",
    getCashboxByIdExpense: "/api/cash-box/expense/",
    getCashboxOperationsCategoy: `/api/cash-box/operation-category/get`,
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
    getByIdPath: "/api/product/",
    getAllProductsCountPath: "/api/product/get/count",
    getTableSettingsPath: "/api/settings/account/get",
    getPriceTypesList: "/api/product/price-type/get",
    getCurrencyPath: "/api/currency/get",
    getCategory: `/api/product/product-category/get`,
    addCategory: `/api/product/product-category/create`,
    updateCategory: `/api/product/product-category/update/`,
    catalogSearch: "/api/product/catalog/search",
    getFavoritProduct: "/api/favorite-product/get/all",
    findByBarcode: `/api/product/find-by-barcode/`,

    //UPDATE
    updateTableSettingsPath:
      "/api/settings/account/product/data-table/column/update",
    updateAlertOn: "/api/warehouse/update/alert-on",
    updateProduct: "/api/product/update/",

    // CREATE
    createProductPath: "/api/product/create",
    createFavouriteProductPath: "/api/favorite-product/add",
    createRegister: "/api/revision/register",
    createExcelFileProduct: `/api/excel/parse`,

    // DELETE
    deleteProductPath: `/api/product/delete`,
    deleteFavoritProductPath: "/api/favorite-product/delete",
  },

  sale: {
    // GET
    register: "/api/sale/register",
    getFiscaldevice: "/api/fiscal-device/get",
    getPaymentPath: "/api/payment-provider/get",
    updateSellPath: "/api/sale/update/",

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
    register: "/api/purchase/register",
    updatePurchasePath: "/api/purchase/update/",
    updatePurchasePricePath: "/api/warehouse-item/update-purchase-price",
  },

  versions: {
    getVersions: "/api/auto-updater/current-version/get",
  },

  fiscalized: {
    // UPDATE
    updateCashRegisterArca: `/api/fiscal-device/arca/update/`,
    updateCashRegisterSimurg: `/api/fiscal-device/simurg/update/`,
    updateCashRegisterHippoPos: `/api/fiscal-device/hippo-pos/update/`,
    updateCashRegisterEPos: `/api/fiscal-device/e-pos/update/`,

    // CREATE
    addCashRegisterArca: `/api/fiscal-device/arca/add`,
    addCashRegisterSimurg: `/api/fiscal-device/simurg/add`,
    addCashRegisterHippoPos: `/api/fiscal-device/hippo-pos/add`,
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
    deletePurchasePath: "/api/purchase/delete/"
  }
};

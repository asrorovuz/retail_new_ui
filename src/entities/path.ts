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
    settingsShiftUpdat: "/api/settings/organization/shift/update"
  },
  warhouse: {
    getList: "/api/warehouse/get",
  },
  cashbox: {
    getAllCashbox: "/api/cash-box/get",
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

    // CREATE
    createFiscalized: "/api/fiscalization/sale/register",
  },

  refund: {
    getCheck: "api/sale/get-by-receipt",
    register: "/api/refund/register",
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
};

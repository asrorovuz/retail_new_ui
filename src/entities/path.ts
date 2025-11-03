export const pathServices = {
  auth: {
    auth: "/public/auth/status",
    login: "/public/auth/login",
    globalLogin: "/public/auth/global-login",
    register: "/public/auth/register"
  },
  init: {
    printPath: "/api/print/"
  },
  settings: {
    // GET
    getSettingsPath: `/api/settings/organization/get`,
    getPrinterName: `/api/print/printers/get`,
  },
  warhouse: {
    getList: "/api/warehouse/get",
  },
  cashbox: {
    getAllCashbox: "/api/cash-box/get"
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

    // DELETE
    deleteProductPath: `/api/product/delete`,
    deleteFavoritProductPath: "/api/favorite-product/delete"
  },
  sale: {
    register: '/api/sale/register',
  }
};

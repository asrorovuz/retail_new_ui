export const pathServices = {
  auth: {
    auth: "/public/auth/status",
    login: "/public/auth/login",
  },
  settings: {
    // GET
    getSettingsPath: `/api/settings/organization/get`,
    getPrinterName: `/api/print/printers/get`,
  },
  warhouse: {
    getList: "/api/warehouse/get",
  },
  products: {
    // GET
    getAllProductsPath: "/api/product/get",
    getAllProductsCountPath: "/api/product/get/count",
    getTableSettingsPath: "/api/settings/account/get",
    getPriceTypesList: "/api/product/price-type/get",
    getCurrencyPath: "/api/currency/get",
    getCategory: `/api/product/product-category/get`,
    addCategory: `/api/product/product-category/create`,
    updateCategory: `/api/product/product-category/update/`,
    catalogSearch: "/api/product/catalog/search",

    //UPDATE
    updateTableSettingsPath:
      "/api/settings/account/product/data-table/column/update",
    updateAlertOn: "/api/warehouse/update/alert-on",

    // CREATE
    createProductPath: "/api/product/create",
    createFavouriteProductPath: "/api/favorite-product/add",

    // DELETE
    deleteProductPath: `/api/product/delete`,
  },
};

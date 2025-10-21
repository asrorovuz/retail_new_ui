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
  products: {
    // GET
    getAllProductsPath: "/api/product/get",
    getAllProductsCountPath: "/api/product/get/count",
    getTableSettingsPath: "/api/settings/account/get",
    getPriceTypesList: '/api/product/price-type/get',

    //UPDATE
    updateTableSettingsPath: "/api/settings/account/product/data-table/column/update",

    // CREATE 
    createProductPath: '/api/product/create',
    createFavouriteProductPath: "/api/favorite-product/add",

    // DELETE 
    deleteProductPath: `/api/product/delete`
  }
};

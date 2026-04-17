// Permission enum yoki constantlar (sizning kodingiz)
export const AccountPermissions = {
  AccountPermissionProductCreate: 1,
  AccountPermissionProductUpdate: 2,
  AccountPermissionProductDelete: 3,
  AccountPermissionProductView: 4,
  AccountPermissionViewProductPurchasePrice: 5,
  AccountPermissionViewProductCommonPrice: 6,
  AccountPermissionViewProductBulkPrice: 7,

  AccountPermissionSaleView: 100,
  AccountPermissionSaleCreate: 101,
  AccountPermissionSaleUpdate: 102,
  AccountPermissionSaleDelete: 103,
  AccountPermissionSaleOperationProductDelete: 104,

  AccountPermissionPurchaseView: 200,
  AccountPermissionPurchaseCreate: 201,
  AccountPermissionPurchaseUpdate: 202,
  AccountPermissionPurchaseDelete: 203,

  AccountPermissionRefundView: 300,
  AccountPermissionRefundCreate: 301,
  AccountPermissionRefundUpdate: 302,
  AccountPermissionRefundDelete: 303,

  AccountPermissionRevisionView: 400,
  AccountPermissionRevisionCreate: 401,
  AccountPermissionRevisionUpdate: 402,
  AccountPermissionRevisionDelete: 403,

  AccountPermissionContractorView: 500,
  AccountPermissionContractorCreate: 501,
  AccountPermissionContractorUpdate: 502,
  AccountPermissionContractorDelete: 503,
  AccountPermissionViewContractorDebt: 504,

  AccountPermissionContractorPaymentView: 600,
  AccountPermissionContractorPaymentCreate: 601,
  AccountPermissionContractorPaymentUpdate: 602,
  AccountPermissionContractorPaymentDelete: 603,

  AccountPermissionPayoutView: 700,
  AccountPermissionPayoutCreate: 701,
  AccountPermissionPayoutUpdate: 702,
  AccountPermissionPayoutDelete: 703,

  AccountPermissionTelegramBotCreate: 800,
  AccountPermissionTelegramBotUpdate: 801,
  AccountPermissionTelegramBotDelete: 802,
  AccountPermissionTelegramBotView: 803,

  AccountPermissionCashBoxView: 900,

  AccountPermissionCashBoxCashInCreate: 910,
  AccountPermissionCashBoxCashInUpdate: 911,
  AccountPermissionCashBoxCashInDelete: 912,
  AccountPermissionCashBoxCashInView: 913,

  AccountPermissionCashBoxCashOutCreate: 920,
  AccountPermissionCashBoxCashOutUpdate: 921,
  AccountPermissionCashBoxCashOutDelete: 922,
  AccountPermissionCashBoxCashOutView: 923,

  AccountPermissionCashBoxExpenseCreate: 930,
  AccountPermissionCashBoxExpenseUpdate: 931,
  AccountPermissionCashBoxExpenseDelete: 932,
  AccountPermissionCashBoxExpenseView: 933,

  AccountPermissionViewPeriodReport: 1000,
} as const;
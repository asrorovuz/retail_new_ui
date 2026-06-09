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

  // AccountPermissionContractorPaymentView: 600,
  // AccountPermissionContractorPaymentCreate: 601,
  // AccountPermissionContractorPaymentUpdate: 602,
  // AccountPermissionContractorPaymentDelete: 603,

  // AccountPermissionPayoutView: 700,
  // AccountPermissionPayoutCreate: 701,
  // AccountPermissionPayoutUpdate: 702,
  // AccountPermissionPayoutDelete: 703,

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

export const PermissionLabels = {
  uz: {
    AccountPermissionProductCreate: "Mahsulot yaratish",
    AccountPermissionProductUpdate: "Mahsulotni tahrirlash",
    AccountPermissionProductDelete: "Mahsulotni o‘chirish",
    AccountPermissionProductView: "Mahsulotlarni ko‘rish",
    AccountPermissionViewProductPurchasePrice: "Tannarx narxini ko‘rish",
    AccountPermissionViewProductCommonPrice: "Sotuv narxini ko‘rish",
    AccountPermissionViewProductBulkPrice: "Ulgurji narxni ko‘rish",

    AccountPermissionSaleView: "Sotuvlarni ko‘rish",
    AccountPermissionSaleCreate: "Sotuv yaratish",
    AccountPermissionSaleUpdate: "Sotuvni tahrirlash",
    AccountPermissionSaleDelete: "Sotuvni o‘chirish",
    AccountPermissionSaleOperationProductDelete: "Sotuvdan mahsulotni o‘chirish",

    AccountPermissionPurchaseView: "Xaridlarni ko‘rish",
    AccountPermissionPurchaseCreate: "Xarid yaratish",
    AccountPermissionPurchaseUpdate: "Xaridni tahrirlash",
    AccountPermissionPurchaseDelete: "Xaridni o‘chirish",

    AccountPermissionRefundView: "Qaytarimlarni ko‘rish",
    AccountPermissionRefundCreate: "Qaytarim yaratish",
    AccountPermissionRefundUpdate: "Qaytarimni tahrirlash",
    AccountPermissionRefundDelete: "Qaytarimni o‘chirish",

    AccountPermissionRevisionView: "Inventarizatsiyani ko‘rish",
    AccountPermissionRevisionCreate: "Inventarizatsiya yaratish",
    AccountPermissionRevisionUpdate: "Inventarizatsiyani tahrirlash",
    AccountPermissionRevisionDelete: "Inventarizatsiyani o‘chirish",

    AccountPermissionContractorView: "Kontragentlarni ko‘rish",
    AccountPermissionContractorCreate: "Kontragent yaratish",
    AccountPermissionContractorUpdate: "Kontragentni tahrirlash",
    AccountPermissionContractorDelete: "Kontragentni o‘chirish",
    AccountPermissionViewContractorDebt: "Qarzdorlikni ko‘rish",

    AccountPermissionContractorPaymentView: "To‘lovlarni ko‘rish",
    AccountPermissionContractorPaymentCreate: "To‘lov yaratish",
    AccountPermissionContractorPaymentUpdate: "To‘lovni tahrirlash",
    AccountPermissionContractorPaymentDelete: "To‘lovni o‘chirish",

    AccountPermissionPayoutView: "Chiqimlarni ko‘rish",
    AccountPermissionPayoutCreate: "Chiqim yaratish",
    AccountPermissionPayoutUpdate: "Chiqimni tahrirlash",
    AccountPermissionPayoutDelete: "Chiqimni o‘chirish",

    AccountPermissionTelegramBotCreate: "Telegram bot yaratish",
    AccountPermissionTelegramBotUpdate: "Telegram botni tahrirlash",
    AccountPermissionTelegramBotDelete: "Telegram botni o‘chirish",
    AccountPermissionTelegramBotView: "Telegram botni ko‘rish",

    AccountPermissionCashBoxView: "Kassani ko‘rish",

    AccountPermissionCashBoxCashInCreate: "Kassaga kirim qilish",
    AccountPermissionCashBoxCashInUpdate: "Kirimni tahrirlash",
    AccountPermissionCashBoxCashInDelete: "Kirimni o‘chirish",
    AccountPermissionCashBoxCashInView: "Kirimlarni ko‘rish",

    AccountPermissionCashBoxCashOutCreate: "Kassadan chiqim qilish",
    AccountPermissionCashBoxCashOutUpdate: "Chiqimni tahrirlash",
    AccountPermissionCashBoxCashOutDelete: "Chiqimni o‘chirish",
    AccountPermissionCashBoxCashOutView: "Chiqimlarni ko‘rish",

    AccountPermissionCashBoxExpenseCreate: "Xarajat yaratish",
    AccountPermissionCashBoxExpenseUpdate: "Xarajatni tahrirlash",
    AccountPermissionCashBoxExpenseDelete: "Xarajatni o‘chirish",
    AccountPermissionCashBoxExpenseView: "Xarajatlarni ko‘rish",

    AccountPermissionViewPeriodReport: "Hisobotlarni ko‘rish",
  },

  oz: {
    AccountPermissionProductCreate: "Маҳсулот яратиш",
    AccountPermissionProductUpdate: "Маҳсулотни таҳрирлаш",
    AccountPermissionProductDelete: "Маҳсулотни ўчириш",
    AccountPermissionProductView: "Маҳсулотларни кўриш",
    AccountPermissionViewProductPurchasePrice: "Таннарх нархини кўриш",
    AccountPermissionViewProductCommonPrice: "Сотув нархини кўриш",
    AccountPermissionViewProductBulkPrice: "Улгуржи нархни кўриш",

    AccountPermissionSaleView: "Сотувларни кўриш",
    AccountPermissionSaleCreate: "Сотув яратиш",
    AccountPermissionSaleUpdate: "Сотувни таҳрирлаш",
    AccountPermissionSaleDelete: "Сотувни ўчириш",
    AccountPermissionSaleOperationProductDelete: "Сотувдан маҳсулотни ўчириш",

    AccountPermissionPurchaseView: "Харидларни кўриш",
    AccountPermissionPurchaseCreate: "Харид яратиш",
    AccountPermissionPurchaseUpdate: "Харидни таҳрирлаш",
    AccountPermissionPurchaseDelete: "Харидни ўчириш",

    AccountPermissionRefundView: "Қайтаримларни кўриш",
    AccountPermissionRefundCreate: "Қайтарим яратиш",
    AccountPermissionRefundUpdate: "Қайтаримни таҳрирлаш",
    AccountPermissionRefundDelete: "Қайтаримни ўчириш",

    AccountPermissionRevisionView: "Инвентаризацияни кўриш",
    AccountPermissionRevisionCreate: "Инвентаризация яратиш",
    AccountPermissionRevisionUpdate: "Инвентаризацияни таҳрирлаш",
    AccountPermissionRevisionDelete: "Инвентаризацияни ўчириш",

    AccountPermissionContractorView: "Контрагентларни кўриш",
    AccountPermissionContractorCreate: "Контрагент яратиш",
    AccountPermissionContractorUpdate: "Контрагентни таҳрирлаш",
    AccountPermissionContractorDelete: "Контрагентни ўчириш",
    AccountPermissionViewContractorDebt: "Қарздорликни кўриш",

    AccountPermissionContractorPaymentView: "Тўловларни кўриш",
    AccountPermissionContractorPaymentCreate: "Тўлов яратиш",
    AccountPermissionContractorPaymentUpdate: "Тўловни таҳрирлаш",
    AccountPermissionContractorPaymentDelete: "Тўловни ўчириш",

    AccountPermissionPayoutView: "Чиқимларни кўриш",
    AccountPermissionPayoutCreate: "Чиқим яратиш",
    AccountPermissionPayoutUpdate: "Чиқимни таҳрирлаш",
    AccountPermissionPayoutDelete: "Чиқимни ўчириш",

    AccountPermissionTelegramBotCreate: "Telegram бот яратиш",
    AccountPermissionTelegramBotUpdate: "Telegram ботни таҳрирлаш",
    AccountPermissionTelegramBotDelete: "Telegram ботни ўчириш",
    AccountPermissionTelegramBotView: "Telegram ботни кўриш",

    AccountPermissionCashBoxView: "Кассани кўриш",

    AccountPermissionCashBoxCashInCreate: "Кассага кирим қилиш",
    AccountPermissionCashBoxCashInUpdate: "Киримни таҳрирлаш",
    AccountPermissionCashBoxCashInDelete: "Киримни ўчириш",
    AccountPermissionCashBoxCashInView: "Киримларни кўриш",

    AccountPermissionCashBoxCashOutCreate: "Кассадан чиқим қилиш",
    AccountPermissionCashBoxCashOutUpdate: "Чиқимни таҳрирлаш",
    AccountPermissionCashBoxCashOutDelete: "Чиқимни ўчириш",
    AccountPermissionCashBoxCashOutView: "Чиқимларни кўриш",

    AccountPermissionCashBoxExpenseCreate: "Харажат яратиш",
    AccountPermissionCashBoxExpenseUpdate: "Харажатни таҳрирлаш",
    AccountPermissionCashBoxExpenseDelete: "Харажатни ўчириш",
    AccountPermissionCashBoxExpenseView: "Харажатларни кўриш",

    AccountPermissionViewPeriodReport: "Ҳисоботларни кўриш",
  },

  ru: {
    AccountPermissionProductCreate: "Создание товара",
    AccountPermissionProductUpdate: "Редактирование товара",
    AccountPermissionProductDelete: "Удаление товара",
    AccountPermissionProductView: "Просмотр товаров",
    AccountPermissionViewProductPurchasePrice: "Просмотр себестоимости",
    AccountPermissionViewProductCommonPrice: "Просмотр цены продажи",
    AccountPermissionViewProductBulkPrice: "Просмотр оптовой цены",

    AccountPermissionSaleView: "Просмотр продаж",
    AccountPermissionSaleCreate: "Создание продажи",
    AccountPermissionSaleUpdate: "Редактирование продажи",
    AccountPermissionSaleDelete: "Удаление продажи",
    AccountPermissionSaleOperationProductDelete: "Удаление товара из продажи",

    AccountPermissionPurchaseView: "Просмотр закупок",
    AccountPermissionPurchaseCreate: "Создание закупки",
    AccountPermissionPurchaseUpdate: "Редактирование закупки",
    AccountPermissionPurchaseDelete: "Удаление закупки",

    AccountPermissionRefundView: "Просмотр возвратов",
    AccountPermissionRefundCreate: "Создание возврата",
    AccountPermissionRefundUpdate: "Редактирование возврата",
    AccountPermissionRefundDelete: "Удаление возврата",

    AccountPermissionRevisionView: "Просмотр инвентаризации",
    AccountPermissionRevisionCreate: "Создание инвентаризации",
    AccountPermissionRevisionUpdate: "Редактирование инвентаризации",
    AccountPermissionRevisionDelete: "Удаление инвентаризации",

    AccountPermissionContractorView: "Просмотр контрагентов",
    AccountPermissionContractorCreate: "Создание контрагента",
    AccountPermissionContractorUpdate: "Редактирование контрагента",
    AccountPermissionContractorDelete: "Удаление контрагента",
    AccountPermissionViewContractorDebt: "Просмотр задолженности",

    AccountPermissionContractorPaymentView: "Просмотр платежей",
    AccountPermissionContractorPaymentCreate: "Создание платежа",
    AccountPermissionContractorPaymentUpdate: "Редактирование платежа",
    AccountPermissionContractorPaymentDelete: "Удаление платежа",

    AccountPermissionPayoutView: "Просмотр расходов",
    AccountPermissionPayoutCreate: "Создание расхода",
    AccountPermissionPayoutUpdate: "Редактирование расхода",
    AccountPermissionPayoutDelete: "Удаление расхода",

    AccountPermissionTelegramBotCreate: "Создание Telegram бота",
    AccountPermissionTelegramBotUpdate: "Редактирование Telegram бота",
    AccountPermissionTelegramBotDelete: "Удаление Telegram бота",
    AccountPermissionTelegramBotView: "Просмотр Telegram бота",

    AccountPermissionCashBoxView: "Просмотр кассы",

    AccountPermissionCashBoxCashInCreate: "Приход в кассу",
    AccountPermissionCashBoxCashInUpdate: "Редактирование прихода",
    AccountPermissionCashBoxCashInDelete: "Удаление прихода",
    AccountPermissionCashBoxCashInView: "Просмотр приходов",

    AccountPermissionCashBoxCashOutCreate: "Расход из кассы",
    AccountPermissionCashBoxCashOutUpdate: "Редактирование расхода",
    AccountPermissionCashBoxCashOutDelete: "Удаление расхода",
    AccountPermissionCashBoxCashOutView: "Просмотр расходов",

    AccountPermissionCashBoxExpenseCreate: "Создание затрат",
    AccountPermissionCashBoxExpenseUpdate: "Редактирование затрат",
    AccountPermissionCashBoxExpenseDelete: "Удаление затрат",
    AccountPermissionCashBoxExpenseView: "Просмотр затрат",

    AccountPermissionViewPeriodReport: "Просмотр отчетов",
  },
};

export const PermissionGroups = {
  uz: [
    {
      label: "Mahsulotlar",
      keys: [
        "AccountPermissionProductView",
        "AccountPermissionProductCreate",
        "AccountPermissionProductUpdate",
        "AccountPermissionProductDelete",
        "AccountPermissionViewProductPurchasePrice",
        "AccountPermissionViewProductCommonPrice",
        "AccountPermissionViewProductBulkPrice",
      ],
    },
    {
      label: "Sotuvlar",
      keys: [
        "AccountPermissionSaleView",
        "AccountPermissionSaleCreate",
        "AccountPermissionSaleUpdate",
        "AccountPermissionSaleDelete",
        "AccountPermissionSaleOperationProductDelete",
      ],
    },
    {
      label: "Xaridlar",
      keys: [
        "AccountPermissionPurchaseView",
        "AccountPermissionPurchaseCreate",
        "AccountPermissionPurchaseUpdate",
        "AccountPermissionPurchaseDelete",
      ],
    },
    {
      label: "Qaytarimlar",
      keys: [
        "AccountPermissionRefundView",
        "AccountPermissionRefundCreate",
        "AccountPermissionRefundUpdate",
        "AccountPermissionRefundDelete",
      ],
    },
    {
      label: "Inventarizatsiya",
      keys: [
        "AccountPermissionRevisionView",
        "AccountPermissionRevisionCreate",
        "AccountPermissionRevisionUpdate",
        "AccountPermissionRevisionDelete",
      ],
    },
    {
      label: "Kontragentlar",
      keys: [
        "AccountPermissionContractorView",
        "AccountPermissionContractorCreate",
        "AccountPermissionContractorUpdate",
        "AccountPermissionContractorDelete",
        "AccountPermissionViewContractorDebt",
      ],
    },
    {
      label: "To'lovlar",
      keys: [
        "AccountPermissionContractorPaymentView",
        "AccountPermissionContractorPaymentCreate",
        "AccountPermissionContractorPaymentUpdate",
        "AccountPermissionContractorPaymentDelete",
      ],
    },
    {
      label: "Chiqimlar",
      keys: [
        "AccountPermissionPayoutView",
        "AccountPermissionPayoutCreate",
        "AccountPermissionPayoutUpdate",
        "AccountPermissionPayoutDelete",
      ],
    },
    {
      label: "Kassa",
      keys: [
        "AccountPermissionCashBoxView",
        "AccountPermissionCashBoxCashInView",
        "AccountPermissionCashBoxCashInCreate",
        "AccountPermissionCashBoxCashInUpdate",
        "AccountPermissionCashBoxCashInDelete",
        "AccountPermissionCashBoxCashOutView",
        "AccountPermissionCashBoxCashOutCreate",
        "AccountPermissionCashBoxCashOutUpdate",
        "AccountPermissionCashBoxCashOutDelete",
        "AccountPermissionCashBoxExpenseView",
        "AccountPermissionCashBoxExpenseCreate",
        "AccountPermissionCashBoxExpenseUpdate",
        "AccountPermissionCashBoxExpenseDelete",
      ],
    },
    {
      label: "Telegram bot",
      keys: [
        "AccountPermissionTelegramBotView",
        "AccountPermissionTelegramBotCreate",
        "AccountPermissionTelegramBotUpdate",
        "AccountPermissionTelegramBotDelete",
      ],
    },
    {
      label: "Hisobotlar",
      keys: ["AccountPermissionViewPeriodReport"],
    },
  ],

  oz: [
    {
      label: "Маҳсулотлар",
      keys: [
        "AccountPermissionProductView",
        "AccountPermissionProductCreate",
        "AccountPermissionProductUpdate",
        "AccountPermissionProductDelete",
        "AccountPermissionViewProductPurchasePrice",
        "AccountPermissionViewProductCommonPrice",
        "AccountPermissionViewProductBulkPrice",
      ],
    },
    {
      label: "Сотувлар",
      keys: [
        "AccountPermissionSaleView",
        "AccountPermissionSaleCreate",
        "AccountPermissionSaleUpdate",
        "AccountPermissionSaleDelete",
        "AccountPermissionSaleOperationProductDelete",
      ],
    },
    {
      label: "Харидлар",
      keys: [
        "AccountPermissionPurchaseView",
        "AccountPermissionPurchaseCreate",
        "AccountPermissionPurchaseUpdate",
        "AccountPermissionPurchaseDelete",
      ],
    },
    {
      label: "Қайтаримлар",
      keys: [
        "AccountPermissionRefundView",
        "AccountPermissionRefundCreate",
        "AccountPermissionRefundUpdate",
        "AccountPermissionRefundDelete",
      ],
    },
    {
      label: "Инвентаризация",
      keys: [
        "AccountPermissionRevisionView",
        "AccountPermissionRevisionCreate",
        "AccountPermissionRevisionUpdate",
        "AccountPermissionRevisionDelete",
      ],
    },
    {
      label: "Контрагентлар",
      keys: [
        "AccountPermissionContractorView",
        "AccountPermissionContractorCreate",
        "AccountPermissionContractorUpdate",
        "AccountPermissionContractorDelete",
        "AccountPermissionViewContractorDebt",
      ],
    },
    {
      label: "Тўловлар",
      keys: [
        "AccountPermissionContractorPaymentView",
        "AccountPermissionContractorPaymentCreate",
        "AccountPermissionContractorPaymentUpdate",
        "AccountPermissionContractorPaymentDelete",
      ],
    },
    {
      label: "Чиқимлар",
      keys: [
        "AccountPermissionPayoutView",
        "AccountPermissionPayoutCreate",
        "AccountPermissionPayoutUpdate",
        "AccountPermissionPayoutDelete",
      ],
    },
    {
      label: "Касса",
      keys: [
        "AccountPermissionCashBoxView",
        "AccountPermissionCashBoxCashInView",
        "AccountPermissionCashBoxCashInCreate",
        "AccountPermissionCashBoxCashInUpdate",
        "AccountPermissionCashBoxCashInDelete",
        "AccountPermissionCashBoxCashOutView",
        "AccountPermissionCashBoxCashOutCreate",
        "AccountPermissionCashBoxCashOutUpdate",
        "AccountPermissionCashBoxCashOutDelete",
        "AccountPermissionCashBoxExpenseView",
        "AccountPermissionCashBoxExpenseCreate",
        "AccountPermissionCashBoxExpenseUpdate",
        "AccountPermissionCashBoxExpenseDelete",
      ],
    },
    {
      label: "Telegram бот",
      keys: [
        "AccountPermissionTelegramBotView",
        "AccountPermissionTelegramBotCreate",
        "AccountPermissionTelegramBotUpdate",
        "AccountPermissionTelegramBotDelete",
      ],
    },
    {
      label: "Ҳисоботлар",
      keys: ["AccountPermissionViewPeriodReport"],
    },
  ],

  ru: [
    {
      label: "Товары",
      keys: [
        "AccountPermissionProductView",
        "AccountPermissionProductCreate",
        "AccountPermissionProductUpdate",
        "AccountPermissionProductDelete",
        "AccountPermissionViewProductPurchasePrice",
        "AccountPermissionViewProductCommonPrice",
        "AccountPermissionViewProductBulkPrice",
      ],
    },
    {
      label: "Продажи",
      keys: [
        "AccountPermissionSaleView",
        "AccountPermissionSaleCreate",
        "AccountPermissionSaleUpdate",
        "AccountPermissionSaleDelete",
        "AccountPermissionSaleOperationProductDelete",
      ],
    },
    {
      label: "Закупки",
      keys: [
        "AccountPermissionPurchaseView",
        "AccountPermissionPurchaseCreate",
        "AccountPermissionPurchaseUpdate",
        "AccountPermissionPurchaseDelete",
      ],
    },
    {
      label: "Возвраты",
      keys: [
        "AccountPermissionRefundView",
        "AccountPermissionRefundCreate",
        "AccountPermissionRefundUpdate",
        "AccountPermissionRefundDelete",
      ],
    },
    {
      label: "Инвентаризация",
      keys: [
        "AccountPermissionRevisionView",
        "AccountPermissionRevisionCreate",
        "AccountPermissionRevisionUpdate",
        "AccountPermissionRevisionDelete",
      ],
    },
    {
      label: "Контрагенты",
      keys: [
        "AccountPermissionContractorView",
        "AccountPermissionContractorCreate",
        "AccountPermissionContractorUpdate",
        "AccountPermissionContractorDelete",
        "AccountPermissionViewContractorDebt",
      ],
    },
    {
      label: "Платежи",
      keys: [
        "AccountPermissionContractorPaymentView",
        "AccountPermissionContractorPaymentCreate",
        "AccountPermissionContractorPaymentUpdate",
        "AccountPermissionContractorPaymentDelete",
      ],
    },
    {
      label: "Расходы",
      keys: [
        "AccountPermissionPayoutView",
        "AccountPermissionPayoutCreate",
        "AccountPermissionPayoutUpdate",
        "AccountPermissionPayoutDelete",
      ],
    },
    {
      label: "Касса",
      keys: [
        "AccountPermissionCashBoxView",
        "AccountPermissionCashBoxCashInView",
        "AccountPermissionCashBoxCashInCreate",
        "AccountPermissionCashBoxCashInUpdate",
        "AccountPermissionCashBoxCashInDelete",
        "AccountPermissionCashBoxCashOutView",
        "AccountPermissionCashBoxCashOutCreate",
        "AccountPermissionCashBoxCashOutUpdate",
        "AccountPermissionCashBoxCashOutDelete",
        "AccountPermissionCashBoxExpenseView",
        "AccountPermissionCashBoxExpenseCreate",
        "AccountPermissionCashBoxExpenseUpdate",
        "AccountPermissionCashBoxExpenseDelete",
      ],
    },
    {
      label: "Telegram бот",
      keys: [
        "AccountPermissionTelegramBotView",
        "AccountPermissionTelegramBotCreate",
        "AccountPermissionTelegramBotUpdate",
        "AccountPermissionTelegramBotDelete",
      ],
    },
    {
      label: "Отчёты",
      keys: ["AccountPermissionViewPeriodReport"],
    },
  ],
} as const;

export type PermissionKey = keyof typeof AccountPermissions;
export type Lang = keyof typeof PermissionLabels;
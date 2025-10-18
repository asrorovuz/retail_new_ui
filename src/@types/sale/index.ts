export type DraftSaleSchema = {
    id?: number
    isActive: boolean
    items: DraftSaleItemSchema[]
    payment?: DraftSalePaymentSchema
    payout?: DraftSalePaymentSchema
    discountAmount?: number
    is_fiscalized?: boolean
}

type DraftSaleItemSchema = {
    id?: number
    productId: number
    productName: string
    productPackageId: number
    productPackageName: string
    priceAmount: number
    priceTypeId: number
    quantity: number
    totalAmount: number
    marks?: string[]
    catalogCode?: string
    catalogName?: string
}

type DraftSalePaymentSchema = {
    amounts: DraftSalePaymentAmountSchema[]
}

type DraftSalePaymentAmountSchema = {
    amount: number
    paymentType: number
}

export interface SaleStoreActions {
    addDraftSale: (payload: DraftSaleSchema) => void
    activateDraftSale: (index: number) => void
    // deleteDraftSale: (draftSaleIndex: number) => void
    // completeActiveDraftSale: () => void
    // resetActiveDraftSale: () => void

    // updateDraftSaleDiscount: (discountAmount: number) => void

    // addDraftSalePaymentAmount: (payload: DraftSalePaymentAmountSchema) => void
    // updateDraftSalePaymentAmounts: (payload: DraftSalePaymentAmountSchema[]) => void

    // addDraftSaleItem: (payload: DraftSaleItemSchema) => void
    // updateDraftSaleItem: (payload: DraftSaleItemSchema) => void
    // deleteDraftSaleItem: (draftSaleItemIndex: number) => void
    // incrementDraftSaleItemQuantity: (draftSaleItemIndex: number) => void
    // decrementDraftSaleItemQuantity: (draftSaleItemIndex: number) => void
    // updateDraftSaleItemQuantity: (draftSaleItemIndex: number, quantity: number) => void
    // updateDraftSaleItemPrice: (draftSaleItemIndex: number, priceAmount: number) => void
    // updateDraftSaleItemTotalPrice: (draftSaleItemIndex: number, totalPrice: number) => void
    // updateDraftSalePayment: (payment: DraftSalePaymentAmountSchema[]) => void
    // deleteDraftSaleMark: (item: { productId: number, index: number }) => void
}

export interface SaleStoreInitialState {
    draftSales: DraftSaleSchema[]
}
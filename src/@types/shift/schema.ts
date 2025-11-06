export type Balance = {
    amount: number
    currencyCode: number
    type: number
}

type BalanceSummary = {
    balances: Balance[]
    total: Omit<Balance, 'type'>[]
}

export type Shift = {
    id: number
    cashboxes_balance_opening: BalanceSummary | null
    cashboxes_balance_closing: BalanceSummary
    cashboxes_expected: BalanceSummary
    difference_balance: BalanceSummary
    cashboxes_in_balance: BalanceSummary
    cashboxes_out_balance: BalanceSummary
    opened_at: string
    closed_at: string
    is_active: boolean
    cash_box_id: number
    account: Account
}

type ShiftContract = {
    account_id: number
    cash_box_id: number
} & Shift & {
        cashboxes_in_balance: BalanceSummary
        cashboxes_out_balance: BalanceSummary
        difference_balance: Balance[]
    }

export type ShiftOperation = {
    id: number
    account_id?: number
    is_active: boolean
    opened_at: string
    closed_at: string | null
    average_check: Omit<Balance, 'type'>

    sale_price: Omit<Balance, 'type'>[]
    sale_count: number
    sale_debts: Omit<Balance, 'type'>[]

    purchase_price: Omit<Balance, 'type'>[]
    purchase_count: number
    purchase_debts: Omit<Balance, 'type'>[]

    shift_contract: ShiftContract
}

type Account = {
    id: number
    name: string
    username: string
    type: number
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}

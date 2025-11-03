import type { CurrencyStoreActions, CurrencyStoreInitialState } from '@/@types/common'
import { create } from 'zustand'

const initialState: CurrencyStoreInitialState = {
    currencies: [],
    nationalCurrency: {
        code: 0,
        created_at: '',
        updated_at: '',
        name: '',
        rate: 0,
        is_national: false,
        is_active: false,
        is_default: false
    }
}

export const useCurrencyStore = create<CurrencyStoreInitialState & CurrencyStoreActions>((set) => ({
    ...initialState,
    setCurrencies: (payload) => set(() => ({ currencies: payload })),
    setNationalCurrency: (payload) => set(() => ({ nationalCurrency: payload }))
}))
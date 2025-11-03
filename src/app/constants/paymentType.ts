import { BsCash, BsPercent } from 'react-icons/bs'

export const CurrencyCodeUZS = 860
export const CurrencyCodeUSD = 840

export const CurrencyRateUZS = 1

export const CurrencyCodeUZSText = 'UZS'
export const CurrencyCodeUSDText = 'USD'

export const PaymentTypeCashCode = 1
export const PaymentTypeUzCardCode = 2
export const PaymentTypeHumoCode = 3
export const PaymentTypeBankTransferCode = 4
export const PaymentTypeClickCode = 5
export const PaymentTypePaymeCode = 6
export const PaymentTypeVisaCode = 7

export const PaymentTypeCashText = 'cash'
export const PaymentTypeUzCardText = 'uzcard'
export const PaymentTypeHumoText = 'humo'
export const PaymentTypeBankTransferText = 'bankTransfer'
export const PaymentTypeClickText = 'click'
export const PaymentTypePaymeText = 'payme'
export const PaymentTypeVisaText = 'visa'


export const paymentTypeList = [
    {
        id: PaymentTypeCashCode,
        text: PaymentTypeCashText,
    },
    {
        id: PaymentTypeUzCardCode,
        text: PaymentTypeUzCardText,
    },
    {
        id: PaymentTypeHumoCode,
        text: PaymentTypeHumoText,
    },
    {
        id: PaymentTypeBankTransferCode,
        text: PaymentTypeBankTransferText,
    },
    {
        id: PaymentTypeClickCode,
        text: PaymentTypeClickText,
    },
    {
        id: PaymentTypePaymeCode,
        text: PaymentTypePaymeText,
    },
    {
        id: PaymentTypeVisaCode,
        text: PaymentTypeVisaText,
    },
]

export const discountTypes = [
    {
        id: 1,
        name: 'interestFree', // Foizsiz,
        icon: BsCash,
    },
    {
        id: 2,
        name: 'percentage', // Foizli
        icon: BsPercent,
    },
]





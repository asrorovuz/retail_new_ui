const PaymentTypeCash = 1
const PaymentTypeUzCard = 2
const PaymentTypeHumo = 3
// const PaymentTypeBankTransfer = 4
const PaymentTypeClick = 5
const PaymentTypePayme = 6
const PaymentTypeVisa = 7


const CurrencyCodeUSD = 840
const CurrencyCodeUZS = 860

const GetPaymentLabel = (type: number) => {
    switch (type) {
        case PaymentTypeCash:
            return 'Наличные'
        case PaymentTypeUzCard:
            return 'UZCARD'
        case PaymentTypeHumo:
            return 'HUMO'
        // case PaymentTypeBankTransfer:
        //     return 'Перечисление'
        case PaymentTypeClick:
            return 'CLICK'
        case PaymentTypePayme:
            return 'PAYME'
        case PaymentTypeVisa:
            return 'VISA'
    }
}

const GetPaymentImageSrc = (type: number) => {
    switch (type) {
        case PaymentTypeCash:
            return "img/payments/cash.png";
        case PaymentTypeUzCard:
            return 'img/payments/uzcard.jpg';
        case PaymentTypeHumo:
            return 'img/payments/humo.png'
        // case PaymentTypeBankTransfer:
        //     return 'img/others/no-image.jpg'
        case PaymentTypeClick:
            return 'img/payments/click.png'
        case PaymentTypePayme:
            return 'img/payments/payme.png'
        case PaymentTypeVisa:
            return 'img/payments/visa.png'
    }
}

const PaymentTypes = [
    {
        type: PaymentTypeCash,
        label: GetPaymentLabel(PaymentTypeCash),
        imageSrc: GetPaymentImageSrc(PaymentTypeCash),
    },
    {
        type: PaymentTypeUzCard,
        label: GetPaymentLabel(PaymentTypeUzCard),
        imageSrc: GetPaymentImageSrc(PaymentTypeUzCard),
    },
    {
        type: PaymentTypeHumo,
        label: GetPaymentLabel(PaymentTypeHumo),
        imageSrc: GetPaymentImageSrc(PaymentTypeHumo),
    },
    // {
    //     type: PaymentTypeBankTransfer,
    //     label: GetPaymentLabel(PaymentTypeBankTransfer),
    //     imageSrc: GetPaymentImageSrc(PaymentTypeBankTransfer),
    // },
    {
        type: PaymentTypeClick,
        label: GetPaymentLabel(PaymentTypeClick),
        imageSrc: GetPaymentImageSrc(PaymentTypeClick),
    },
    {
        type: PaymentTypePayme,
        label: GetPaymentLabel(PaymentTypePayme),
        imageSrc: GetPaymentImageSrc(PaymentTypePayme),
    },
    {
        type: PaymentTypeVisa,
        label: GetPaymentLabel(PaymentTypeVisa),
        imageSrc: GetPaymentImageSrc(PaymentTypeVisa),
    },

]

export {
    GetPaymentLabel,
    GetPaymentImageSrc
}

export {
    PaymentTypes,

    PaymentTypeCash,
    PaymentTypeUzCard,
    PaymentTypeHumo,
    // PaymentTypeBankTransfer,
    PaymentTypeClick,
    PaymentTypePayme,
    PaymentTypeVisa,
    CurrencyCodeUSD,
    CurrencyCodeUZS,
}
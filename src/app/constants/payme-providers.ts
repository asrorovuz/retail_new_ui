import paymeLogo from "/img/payments/payme.png";
import clickLogo from "/img/payments/click.png";

export const PaymentProviderTypePayme = 1;
export const PaymentProviderTypeClick = 2;

export const GetPaymentProviderName = (type: number) => {
    switch (type) {
        case PaymentProviderTypePayme:
            return "Payme";
        case PaymentProviderTypeClick:
            return "Click";
        default:
            return "";
    }
};

export const GetPaymentProviderLogo = (type: number) => {
    switch (type) {
        case PaymentProviderTypePayme:
            return paymeLogo;
        case PaymentProviderTypeClick:
            return clickLogo;
        default:
            return "";
    }
};

const getPaymentProviderType = (type: number, name: string, logo: string) => {
    return {
        type,
        name,
        logo,
    }
}

export const PaymentProviderTypes = [
    getPaymentProviderType(PaymentProviderTypePayme, GetPaymentProviderName(PaymentProviderTypePayme), GetPaymentProviderLogo(PaymentProviderTypeClick)),
    getPaymentProviderType(PaymentProviderTypeClick, GetPaymentProviderName(PaymentProviderTypeClick), GetPaymentProviderLogo(PaymentProviderTypeClick)),
];
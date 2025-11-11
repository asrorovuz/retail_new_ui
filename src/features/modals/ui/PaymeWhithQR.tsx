import type { PaymeProviderType } from "@/@types/sale";
import {
  GetPaymentProviderLogo,
  PaymentProviderTypeClick,
  PaymentProviderTypePayme,
} from "@/app/constants/payme-providers";
import {
  useCreateFiscalizedApi,
  usePaymentProviderApi,
} from "@/entities/sale/repository";
import classNames from "@/shared/lib/classNames";
import eventBus from "@/shared/lib/eventBus";
import { Button, Dialog } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import qrImg from "@/app/assets/qrcode-checked.png";
import { toast } from "react-toastify";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import type { FizcalResponsetype } from "@/entities/sale/model";
import { messages } from "@/app/constants/message.request";

type PropsPaymeQrType = {
  isOpen: boolean;
  saleId: number | null;
  selectFiscalized: FizcalResponsetype | null;
  selectedPaymentType: number;
  handleCancelFiscalization: () => void;
  handleCancelPayment: () => void;
};

const PaymeWhithQR = ({
  isOpen,
  selectedPaymentType,
  saleId,
  selectFiscalized,
  handleCancelFiscalization,
  handleCancelPayment,
}: PropsPaymeQrType) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [selectedPayment, setSelectedPayment] =
    useState<PaymeProviderType | null>(null);

  const { data: paymentData = [] } = usePaymentProviderApi();
  const { mutate: createFiscalized, isPending: fiscalPending } =
    useCreateFiscalizedApi();

  const payment = (paymentData ?? []).filter(
    (elem: any) =>
      [PaymentProviderTypePayme, PaymentProviderTypeClick].includes(
        elem?.type
      ) && elem?.is_enabled
  );

  const onCancel = () => {
    handleCancelPayment();
    setQrCode("");
    setSelectedPayment(null);
  };

  const handleApprovePayment = () => {
    const payment: any = (paymentData ?? []).find(
      (elem: any) =>
        elem?.type === selectedPaymentType && elem?.is_enabled === true
    );

    const payload = {
      sale_id: saleId,
      fiscal_device_id: selectFiscalized?.id,
      payment_card_type: selectedPayment?.type ?? payment?.type,
      ...(qrCode && {
        qr_payment: {
          qr_content: String(qrCode),
          payment_provider_id: selectedPayment?.id,
        },
      }),
    };

    createFiscalized(payload, {
      onSuccess() {
        showSuccessMessage(
          messages.uz.SUCCESS_MESSAGE,
          messages.ru.SUCCESS_MESSAGE
        );
        handleCancelFiscalization();
        setQrCode("");
        setSelectedPayment(null);
      },
      onError(error) {
        showErrorMessage(error);
      },
    });
  };

  const handleNext = async () => {
    if (!selectedPayment) {
      toast.warning("Выберите тип оплата");
      return;
    }

    try {
      handleApprovePayment();
    } catch (err) {
      showErrorMessage(err);
      close();
    }
  };

  useEffect(() => {
    if (payment) {
      const select = payment?.find(
        (item) => item?.type === selectedPaymentType
      );
      setSelectedPayment(select ?? null);
    }
  }, [selectedPaymentType]);

  useEffect(() => {
    const listener = (code: string) => {
      setQrCode(code);
    };
    eventBus.on("BARCODE_SCANNED", listener);

    return () => eventBus.remove("BARCODE_SCANNED", listener);
  }, []);

  return (
    <Dialog
      onClose={onCancel}
      width={490}
      title={"Хотите совершить QR-платеж "}
      isOpen={isOpen}
    >
      <div className="bg-gray-50 rounded-2xl p-3 flex flex-col gap-y-3 mb-6">
        <div className="h-[222px] w-[222px] flex items-center justify-center mx-auto">
          {qrCode ? (
            <img
              className="w-full h-full object-contain"
              src={qrImg}
              alt="QR Code"
            />
          ) : (
            <h6 className="text-center text-gray-800">
              Выберите тип оплаты и отсканируйте QR-код
            </h6>
          )}
        </div>
        <div>
          {payment?.length && (
            <div className={"flex items-center gap-x-2"}>
              {payment?.map((item: any, index: number) => {
                const isSelected =
                  selectedPayment && selectedPayment?.id === item?.id;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedPayment(item)}
                    className={classNames(
                      "bg-white w-full rounded-lg overflow-hidden",
                      isSelected && "bg-blue-50"
                    )}
                  >
                    {GetPaymentProviderLogo(Number(item?.type)) && (
                      <div className="w-full flex items-center justify-center">
                        <img
                          className="w-full h-20 object-contain"
                          src={GetPaymentProviderLogo(Number(item?.type))}
                          alt={item?.name}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-x-2">
        <Button onClick={onCancel}>Нет</Button>
        <Button loading={fiscalPending} onClick={handleNext} variant="solid">
          Далее
        </Button>
      </div>
    </Dialog>
  );
};

export default PaymeWhithQR;

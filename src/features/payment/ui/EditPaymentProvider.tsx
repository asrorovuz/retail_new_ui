import {
  PaymentProviderTypeClick,
  PaymentProviderTypePayme,
} from "@/app/constants/payme-providers";
import { Button, Dialog, Form } from "@/shared/ui/kit";
import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import PaymentProviderForm from "./PaymentProviderForm";
import {
  useUpdatePaymentClick,
  useUpdatePaymentPay,
} from "@/entities/settings/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";

interface EditPaymentProviderModalProps {
  paymentProvider: any;
  onUpdated?: () => void;
}

export default function EditPaymentProvider({
  paymentProvider,
}: EditPaymentProviderModalProps) {
  const [show, setShow] = useState(false);

  const methods = useForm({
    defaultValues: {},
  });

  const { mutate: updatePay, isPending: payLoading } = useUpdatePaymentPay();
  const { mutate: updateClick, isPending: clickLoading } =
    useUpdatePaymentClick();

  function handleShow() {
    setShow(true);
    methods.reset({
      id: paymentProvider?.id || null,
      type: paymentProvider?.type || null,
      isEnabled: paymentProvider?.is_enabled ?? true,

      ...(Number(paymentProvider?.type) === PaymentProviderTypePayme && {
        payme: {
          merchantCashBoxId: paymentProvider?.info?.cash_box_id || "",
          merchantCashBoxKey: paymentProvider?.info?.cash_box_name || "",
        },
      }),

      ...(Number(paymentProvider?.type) === PaymentProviderTypeClick && {
        click: {
          serviceId: paymentProvider?.info?.service_id || "",
          merchantId: paymentProvider?.info?.merchant_id || "",
          merchantUserId: paymentProvider?.info?.merchant_user_id || "",
          secretKey: paymentProvider?.info?.secret_key || "",
        },
      }),
    });
  }

  function handleClose() {
    methods.reset();
    setShow(false);
  }

  const successFunc = () => {
    showSuccessMessage(
      messages.uz.SUCCESS_MESSAGE,
      messages.ru.SUCCESS_MESSAGE
    );
    handleClose();
  };

  const onSubmit = (formData: any) => {
    if (Number(formData.type) === PaymentProviderTypePayme) {
      updatePay(
        {
          id: paymentProvider?.id,
          payload: {
            is_enabled: formData.isEnabled,
            cash_box_id: formData.payme?.merchantCashBoxId,
            cash_box_key: formData.payme?.merchantCashBoxKey,
          },
        },
        {
          onSuccess() {
            successFunc();
          },
          onError(error) {
            showErrorMessage(error);
          },
        }
      );
    }

    if (Number(formData.type) === PaymentProviderTypeClick) {
      updateClick(
        {
          id: paymentProvider?.id,
          payload: {
            is_enabled: formData.isEnabled,
            service_id: Number(formData.click?.serviceId),
            merchant_id: Number(formData.click?.merchantId),
            merchant_user_id: Number(formData.click?.merchantUserId),
            secret_key: formData.click?.secretKey,
          },
        },
        {
          onSuccess() {
            successFunc();
          },
          onError(error) {
            showErrorMessage(error);
          },
        }
      );
    }
  };

  let loading = payLoading || clickLoading;

  return (
    <Fragment>
      <Button
        className="p-0 bg-transparent text-blue-500 hover:text-blue-400 transition-all duration-200"
        onClick={handleShow}
        size="sm"
        variant="plain"
      >
        <FaEdit size={20} />
      </Button>

      <Dialog
        title={"Редактировать провайдера оплаты"}
        className="w-full max-w-2xl"
        isOpen={show}
        onClose={handleClose}
      >
        <FormProvider {...methods}>
          <Form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <PaymentProviderForm />
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button onClick={handleClose} type="button">
                Отмена
              </Button>
              <Button disabled={loading} variant={"solid"} type={"submit"}>
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </Dialog>
    </Fragment>
  );
}

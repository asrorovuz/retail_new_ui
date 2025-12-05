import { messages } from "@/app/constants/message.request";
import {
  PaymentProviderTypeClick,
  PaymentProviderTypePayme,
} from "@/app/constants/payme-providers";
import { useCreateClick, useCreatePayme } from "@/entities/settings/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Form } from "@/shared/ui/kit";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Fragment } from "react/jsx-runtime";
import PaymentProviderForm from "./PaymentProviderForm";

export default function AddPaymentProvider() {
  const [show, setShow] = useState(false);

  const { mutate: mutatePayme, isPending: paymeLoading } = useCreatePayme();
  const { mutate: mutateClick, isPending: clickLoading } = useCreateClick();

  const methods = useForm({
    defaultValues: {},
  });

  function handleShow() {
    setShow(true);
  }

  const handleClose = () => {
    methods.reset();
    setShow(false);
  };

  const onSubmit = (formData: any) => {
    console.log(formData);
    
    if (Number(formData.type) === PaymentProviderTypePayme) {
      mutatePayme(
        {
          is_enabled: formData.isEnabled ?? true,
          cash_box_id: formData.payme?.merchantCashBoxId,
          cash_box_key: formData.payme?.merchantCashBoxKey,
        },
        {
          onSuccess() {
            handleClose();
            showSuccessMessage(
              messages.uz.SUCCESS_MESSAGE,
              messages.ru.SUCCESS_MESSAGE
            );
          },
          onError(error) {
            showErrorMessage(error);
          },
        }
      );
    }

    if (Number(formData.type) === PaymentProviderTypeClick) {
      mutateClick(
        {
          is_enabled: formData.isEnabled ?? true,
          service_id: Number(formData.click?.serviceId),
          merchant_id: Number(formData.click?.merchantId),
          merchant_user_id: Number(formData.click?.merchantUserId),
          secret_key: formData.click?.secretKey,
        },
        {
          onSuccess() {
            handleClose();
            showSuccessMessage(
              messages.uz.SUCCESS_MESSAGE,
              messages.ru.SUCCESS_MESSAGE
            );
          },
          onError(error) {
            showErrorMessage(error);
          },
        }
      );
    }
  };

  let loading = paymeLoading || clickLoading;
  return (
    <Fragment>
      <Button onClick={handleShow} size="sm" variant="solid">
        + Добавить поставщика платежных услуг
      </Button>
      <Dialog
        className="w-full min-h-max max-w-2xl"
        title={"Добавить нового провайдера платежей"}
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
              <Button variant="solid" type="submit" disabled={loading}>
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </Dialog>
    </Fragment>
  );
}

import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Button, Dialog, Form } from "@/shared/ui/kit";
import {
  useCreateArca,
  useCreateEPos,
  useCreateHippoPos,
  useCreateSimurg,
} from "@/entities/settings/repository";
import {
  CashRegisterProviderTypeArca,
  CashRegisterProviderTypeEPos,
  CashRegisterProviderTypeHippoPos,
  CashRegisterProviderTypeSimurg,
} from "@/shared/lib/cashProvider";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import CashRegisterForm from "./FiscalizedForm";

const AddFiscalDevice = () => {
  const [show, setShow] = useState(false);
  const methods = useForm();

  const { mutate: mutateArca, isPending: arcaLoading } = useCreateArca();
  const { mutate: mutateSimurg, isPending: simurgLoading } = useCreateSimurg();
  const { mutate: mutateEPos, isPending: eposLoading } = useCreateEPos();
  const { mutate: mutateHippoPos, isPending: hippoposLoading } =
    useCreateHippoPos();

  const handleShow = () => {
    setShow(true);
  };

  const successFunc = () => {
    showSuccessMessage(
      messages.uz.SUCCESS_MESSAGE,
      messages.ru.SUCCESS_MESSAGE
    );
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    methods.reset();
  };

  const onSubmit = (data: any) => {
    console.log(data);
    
    if (Number(data.type) === CashRegisterProviderTypeArca) {
      mutateArca(
        {
          is_enabled: data.isEnabled ?? true,
          name: data.name,
          address: data.arca?.address,
          username: data.arca?.username,
          password: data.arca?.password,
        },
        {
          onSuccess() {
            successFunc();
          },
          onError(err) {
            showErrorMessage(err);
          },
        }
      );
    }

    if (Number(data.type) === CashRegisterProviderTypeHippoPos) {
      mutateHippoPos(
        {
          name: data.name,
          is_enabled: data.isEnabled ?? true,
          company_name: data.hippopos?.companyName,
          company_address: data.hippopos?.companyAddress,
          company_inn: data.hippopos?.companyInn,
          printer_size: Number(data.hippopos?.printerSize),
        },
        {
          onSuccess() {
            successFunc();
          },
          onError(err) {
            showErrorMessage(err);
          },
        }
      );
    }

    if (Number(data.type) === CashRegisterProviderTypeEPos) {
      mutateEPos(
        {
          name: data.name,
          is_enabled: data.isEnabled ?? true,
          company_name: data.epos?.companyName,
          company_address: data.epos?.companyAddress,
          company_inn: data.epos?.companyInn,
          printer_size: Number(data.epos?.printerSize),
        },
        {
          onSuccess() {
            successFunc();
          },
          onError(err) {
            showErrorMessage(err);
          },
        }
      );
    }

    if (Number(data.type) === CashRegisterProviderTypeSimurg) {
      mutateSimurg(
        {
          is_enabled: data.isEnabled ?? true,
          name: data.name,
          com_port_number: Number(data.simurg?.comPortNumber),
          cashier_password: Number(data.simurg?.cashierPassword),
        },
        {
          onSuccess() {
            successFunc();
          },
          onError(err) {
            showErrorMessage(err);
          },
        }
      );
    }
  };

  let loading = simurgLoading || arcaLoading || eposLoading || hippoposLoading;

  return (
    <Fragment>
      <Button onClick={handleShow} size="sm" variant="solid">
        + Добавить кассовый аппарат
      </Button>
      <Dialog title={"Добавление кассового аппарата"} className="w-full max-w-2xl" isOpen={show} onClose={handleClose}>
        <FormProvider {...methods}>
          <Form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <CashRegisterForm />
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
};

export default AddFiscalDevice;

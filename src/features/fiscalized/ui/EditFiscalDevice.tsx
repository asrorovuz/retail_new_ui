import { messages } from "@/app/constants/message.request";
import {
  useUpdateArca,
  useUpdateEPos,
  useUpdateHippoPos,
  useUpdateSimurg,
} from "@/entities/settings/repository";
import {
  CashRegisterProviderTypeArca,
  CashRegisterProviderTypeEPos,
  CashRegisterProviderTypeHippoPos,
  CashRegisterProviderTypeSimurg,
} from "@/shared/lib/cashProvider";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Form } from "@/shared/ui/kit";
import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CashRegisterForm from "./FiscalizedForm";
import { FaEdit } from "react-icons/fa";

const EditFiscalDevice = ({ getCashRegisterData }: any) => {
  const [show, setShow] = useState(false);
  const methods = useForm();

  const { mutate: updateMutateArca, isPending: arcaLoading } = useUpdateArca();
  const { mutate: updateMutateSimurg, isPending: simurgLoading } =
    useUpdateSimurg();
  const { mutate: updateMutateHippoPos, isPending: hippoposLoading } =
    useUpdateHippoPos();
  const { mutate: updateMutateEPos, isPending: eposLoading } = useUpdateEPos();

  const handleShow = () => {
    setShow(true);
    methods.reset({
      id: getCashRegisterData?.id || null,
      name: getCashRegisterData?.name || "",
      type: getCashRegisterData?.type || "",
      isEnabled: getCashRegisterData?.is_enabled,

      ...(Number(getCashRegisterData?.type) ===
        CashRegisterProviderTypeArca && {
        arca: {
          address: getCashRegisterData?.info?.address || "",
          username: getCashRegisterData?.info?.username || "",
          password: getCashRegisterData?.info?.password || "",
        },
      }),

      ...(Number(getCashRegisterData?.type) ===
        CashRegisterProviderTypeHippoPos && {
        hippopos: {
          companyName: getCashRegisterData?.info?.company_name || "",
          companyAddress: getCashRegisterData?.info?.company_address || "",
          companyInn: getCashRegisterData?.info?.company_inn || "",
          printerSize: String(getCashRegisterData?.info?.printer_size) || 0,
        },
      }),

      ...(Number(getCashRegisterData?.type) ===
        CashRegisterProviderTypeSimurg && {
        simurg: {
          comPortNumber:
            String(getCashRegisterData?.info?.com_port_number) || 0,
          cashierPassword:
            String(getCashRegisterData?.info?.cashier_password) || 0,
        },
      }),

      ...(Number(getCashRegisterData?.type) ===
        CashRegisterProviderTypeEPos && {
        epos: {
          companyName: getCashRegisterData?.info?.company_name || "",
          companyAddress: getCashRegisterData?.info?.company_address || "",
          companyInn: getCashRegisterData?.info?.company_inn || "",
          printerSize: String(getCashRegisterData?.info?.printer_size) || "",
        },
      }),
    });
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

  const onSubmit = (item: any) => {
    if (Number(item.type) === CashRegisterProviderTypeArca) {
      updateMutateArca(
        {
          id: item?.id,
          payload: {
            is_enabled: item.isEnabled,
            name: item.name,
            address: item.arca?.address,
            username: item.arca?.username,
            password: item.arca?.password,
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

    if (Number(item.type) === CashRegisterProviderTypeHippoPos) {
      updateMutateHippoPos(
        {
          id: item.id,
          payload: {
            name: item.name,
            is_enabled: item.isEnabled,
            company_name: item.hippopos?.companyName,
            company_address: item.hippopos?.companyAddress,
            company_inn: item.hippopos?.companyInn,
            printer_size: Number(item.hippopos?.printerSize),
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

    if (Number(item.type) === CashRegisterProviderTypeEPos) {
      updateMutateEPos(
        {
          id: item.id,
          payload: {
            name: item.name,
            is_enabled: item.isEnabled,
            company_name: item.epos?.companyName,
            company_address: item.epos?.companyAddress,
            company_inn: item.epos?.companyInn,
            printer_size: Number(item.epos?.printerSize),
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

    if (Number(item.type) === CashRegisterProviderTypeSimurg) {
      updateMutateSimurg(
        {
          id: item.id,
          payload: {
            is_enabled: item.isEnabled,
            name: item.name,
            com_port_number: Number(item.simurg?.comPortNumber),
            cashier_password: Number(item.simurg?.cashierPassword),
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

  let loading = simurgLoading || arcaLoading || eposLoading || hippoposLoading;

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
        title={"Добавление кассового аппарата"}
        className="w-full max-w-2xl"
        isOpen={show}
        onClose={handleClose}
      >
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

export default EditFiscalDevice;

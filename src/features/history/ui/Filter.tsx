import { useGetAllAcounts } from "@/entities/auth/repository";
import {
  useContragentApi
} from "@/entities/history/repository";
import { Button, Dialog, Form, Select } from "@/shared/ui/kit";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface ParamType {
  is_approved: any | OptionType;
  contractor_id: any | null;
  used_warehouses: any | null;
  employee_id: any | null;
  is_for_debt: null | OptionType;
}

interface PropsType {
  type: "sale" | "refund" | "purchase" | "return_purchase";
  isOpenFilter: boolean;
  setIsOpenFilter: (val: boolean) => void;
  setParams: any;
  countyparty?: boolean
}

interface OptionType {
  value: boolean;
  label: string;
}

const initialValue = {
  is_approved: null,
  contractor_id: null,
  used_warehouses: null,
  employee_id: null,
  is_for_debt: null,
};

const Filter = ({
  type,
  isOpenFilter,
  setIsOpenFilter,
  setParams,
  countyparty=false
}: PropsType) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<ParamType>({
    defaultValues: initialValue,
  });

  const booleanOptions = [
    { value: true, label: t("common.yes") },
    { value: false, label: t("common.no") },
  ];

  const { data: accountsData } = useGetAllAcounts()
  const { data: contragentData } = useContragentApi(isOpenFilter);

  const employeeOption = useMemo(() => {
    return accountsData?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
  }, [accountsData]);

  const contragentOption = useMemo(() => {
    return contragentData?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
  }, [contragentData]);

  const clearField = () => {
    reset(initialValue);
    setParams((prev: any) => ({ ...prev, ...initialValue, ...(countyparty && { contractor_id: prev.contractor_id }), }));
  };

  const onSubmit = (data: ParamType) => {
    const formattedData = {
      ...data,
      is_approved: data?.is_approved?.value ?? null,
      is_for_debt: data?.is_for_debt?.value ?? null,
      used_warehouses: data?.used_warehouses?.value ?? null,
      ...(!countyparty && { contractor_id: data?.contractor_id?.value ?? null }),
      employee_id: data?.employee_id?.value ?? null,
    };

    setParams((prev: any) => ({ ...prev, ...formattedData, ...(countyparty && { contractor_id: prev.contractor_id }), }));
    setIsOpenFilter(false)
  };

  useEffect(() => {
    clearField();
  }, [type]);

  return (
    <Dialog
      title={t("common.filter")}
      width={"80vw"}
      isOpen={isOpenFilter}
      onRequestClose={() => setIsOpenFilter(false)}
      overlayClassName={"bg-black/10 !backdrop-blur-0"}
      onClose={() => setIsOpenFilter(false)}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-5 mb-5">
          {!countyparty && <Controller
            name="contractor_id"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  size="sm"
                  value={field.value}
                  placeholder={t("counterparty.title")}
                  options={contragentOption}
                  onChange={field.onChange}
                />
              );
            }}
          />}

          <Controller
            name="employee_id"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  size="sm"
                  value={field.value}
                  placeholder={t("common.employee")}
                  options={employeeOption}
                  onChange={field.onChange}
                />
              );
            }}
          />

          <Controller
            name="is_for_debt"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  size="sm"
                  value={field.value}
                  placeholder={t("sale.debt")}
                  options={booleanOptions}
                  onChange={field.onChange}
                />
              );
            }}
          />
        </div>
        <div className="flex justify-end gap-x-2 w-full mb-5">
          <Button size="sm" icon={<MdClose />} onClick={clearField}>
            {t("common.reset")}
          </Button>
          <Button size="sm" icon={<FiSearch />} variant="solid" type="submit">
            {t("common.search")}
          </Button>
        </div>
      </Form>
    </Dialog>
  );
};

export default Filter;

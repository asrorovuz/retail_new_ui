import {
  useContragentApi,
  useEmployeeApi,
} from "@/entities/history/repository";
import { useWarehouseApi } from "@/entities/init/repository";
import { Button, DatePicker, Form, Select } from "@/shared/ui/kit";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { MdClose } from "react-icons/md";

interface ParamType {
  date_start: Date | null;
  date_end: Date | null;
  is_approved: any | OptionType;
  contractor_id: any | null;
  used_warehouses: any | null;
  employee_id: any | null;
  is_for_debt: null | OptionType;
}

interface PropsType {
  type: "sale" | "refund" | "purchase";
  isOpenFilter: boolean;
  setParams: any;
}

interface OptionType {
  value: boolean;
  label: string;
}

const initialValue = {
  date_start: null,
  date_end: null,
  is_approved: null,
  contractor_id: null,
  used_warehouses: null,
  employee_id: null,
  is_for_debt: null,
};

const booleanOptions = [
  { value: true, label: "Да" },
  { value: false, label: "Нет" },
];
const statusOptions = [
  { value: true, label: "Одобренный" },
  { value: false, label: "Неодобренный" },
];

const Filter = ({ type, isOpenFilter = false, setParams }: PropsType) => {
  const { control, handleSubmit, reset } = useForm<ParamType>({
    defaultValues: initialValue,
  });

  const { data: wareHouseData } = useWarehouseApi();
  const { data: employeeData } = useEmployeeApi(isOpenFilter);
  const { data: contragentData } = useContragentApi(isOpenFilter);

  const employeeOption = useMemo(() => {
    return employeeData?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
  }, [employeeData]);

  const contragentOption = useMemo(() => {
    return contragentData?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
  }, [contragentData]);

  const wareHouseOption = useMemo(() => {
    return wareHouseData?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
  }, [contragentData]);

  const clearField = () => {
    reset(initialValue);
    setParams((prev: any) => ({...prev, ...initialValue}))
  };

  const onSubmit = (data: ParamType) => {
    const formattedData = {
      ...data,
      date_start: data.date_start
        ? dayjs(data.date_start).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null,

      date_end: data.date_end
        ? dayjs(data.date_end).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null,
      is_approved: data?.is_approved?.value ?? null,
      is_for_debt: data?.is_for_debt?.value ?? null,
      used_warehouses: data?.used_warehouses?.value ?? null,
      contractor_id: data?.contractor_id?.value ?? null,
      employee_id: data?.employee_id?.value ?? null,
    };

    setParams((prev: any) => ({...prev, ...formattedData}))
  };

  useEffect(() => {
    clearField()
  }, [type, isOpenFilter]);

  return isOpenFilter ? (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-5 mb-5">
        <Controller
          name="date_start"
          control={control}
          render={({ field }) => {
            return (
              <div className="relative">
                <DatePicker
                  inputFormat="DD-MM-YYYY"
                  size="sm"
                  placeholder={"Дата начала"}
                  closePickerOnChange={true}
                  inputtable={true}
                  onChange={field.onChange}
                  value={field.value}
                />
              </div>
            );
          }}
        />

        <Controller
          name="date_end"
          control={control}
          render={({ field }) => {
            return (
              <div className="relative">
                <DatePicker
                  inputFormat="DD-MM-YYYY"
                  size="sm"
                  placeholder={"Дата окончания"}
                  closePickerOnChange={true}
                  inputtable={true}
                  onChange={field.onChange}
                  value={field.value}
                />
              </div>
            );
          }}
        />

        <Controller
          name="is_approved"
          control={control}
          render={({ field }) => {
            return (
              <Select
                size="sm"
                value={field.value}
                isClearable
                placeholder={"Статус"}
                options={statusOptions}
                onChange={field.onChange}
              />
            );
          }}
        />

        <Controller
          name="contractor_id"
          control={control}
          render={({ field }) => {
            return (
              <Select
                size="sm"
                value={field.value}
                placeholder={"Контрагент"}
                options={contragentOption}
                onChange={field.onChange}
              />
            );
          }}
        />

        <Controller
          name="used_warehouses"
          control={control}
          render={({ field }) => {
            return (
              <Select
                size="sm"
                value={field.value}
                options={wareHouseOption}
                placeholder={"Склад"}
                onChange={field.onChange}
              />
            );
          }}
        />

        <Controller
          name="employee_id"
          control={control}
          render={({ field }) => {
            return (
              <Select
                size="sm"
                value={field.value}
                placeholder={"Сотрудник"}
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
                placeholder={"По долгу"}
                options={booleanOptions}
                onChange={field.onChange}
              />
            );
          }}
        />
      </div>
      <div className="flex justify-end gap-x-2 w-full mb-5">
        <Button icon={<MdClose />} onClick={clearField}>Сбросить</Button>
        <Button icon={<FiSearch />} variant="solid" type="submit">
          Найти
        </Button>
      </div>
    </Form>
  ) : (
    ""
  );
};

export default Filter;

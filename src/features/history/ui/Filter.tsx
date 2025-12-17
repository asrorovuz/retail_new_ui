import { Button, DatePicker, Form } from "@/shared/ui/kit";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";

interface ParamType {
  date_start: Date | null;
  date_end: Date | null;
  is_approved: boolean | null;
  contractor_id: number | null;
  used_warehouses: number[] | null;
  employee_id: number | null;
  is_for_debt: boolean | null;
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

const Filter = () => {
  const { control, handleSubmit, reset } = useForm<ParamType>({
    defaultValues: initialValue,
  });

  const clearField = () => {
    reset(initialValue);
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
    };

    console.log(formattedData, "formattedData");
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center flex-wrap gap-x-5 mb-5">
        <Controller
          name="date_start"
          control={control}
          render={({ field }) => {
            return (
              <DatePicker
                inputFormat="DD-MM-YYYY"
                size="sm"
                className="max-w-[250px]"
                placeholder={"Выберите дату"}
                closePickerOnChange={true}
                inputtable={true}
                onChange={field.onChange}
                value={field.value}
              />
            );
          }}
        />

        <Controller
          name="date_end"
          control={control}
          render={({ field }) => {
            return (
              <DatePicker
                inputFormat="DD-MM-YYYY"
                size="sm"
                className="max-w-[250px]"
                placeholder={"Выберите дату"}
                closePickerOnChange={true}
                inputtable={true}
                onChange={field.onChange}
                value={field.value}
              />
            );
          }}
        />
      </div>
      <div className="flex justify-end gap-x-2 w-full">
        <Button onClick={clearField}>Сбросить</Button>
        <Button variant="solid" type="submit">Найти</Button>
      </div>
    </Form>
  );
};

export default Filter;

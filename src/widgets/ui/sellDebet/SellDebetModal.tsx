import { Button, Dialog, FormItem, Input, Select } from "@/shared/ui/kit";
import { useState } from "react";

const SellDebetModal = ({ onCancel, onSubmit }: any) => {
  const [contragent, setContragent] = useState({
    cont1: null,
    cont2: null,
    content: null,
  });

  return (
    <Dialog width={350} title={"Выборь клиента"} isOpen onClose={onCancel}>
      <FormItem labelClass="mb-1" className="mb-1 pb-1" label="Клеиент">
        <Select
          options={[]}
          size="sm"
          className="w-full bg-white"
          placeholder={"Клеиент"}
          // getOptionLabel={(option) => option?.label}
          // getOptionValue={(option) => option?.id}
        />
      </FormItem>

      <FormItem label="Сотрудник">
        <Select
          options={[]}
          size="sm"
          className="w-full bg-white"
          placeholder={"Сотрудник"}
          // getOptionLabel={(option) => option?.label}
          // getOptionValue={(option) => option?.id}
        />
      </FormItem>

      <FormItem label="Клеиент">
        <textarea className="w-full border rounded-xl resize-none h-32"/>
      </FormItem>

      <div className="flex gap-x-2">
        <Button onClick={onCancel} className="w-full" size="sm" type="button">
          Отменить
        </Button>
        <Button
          onSubmit={onSubmit}
          className="w-full"
          size="sm"
          type="button"
          variant="solid"
        >
          Сохранить
        </Button>
      </div>
    </Dialog>
  );
};

export default SellDebetModal;

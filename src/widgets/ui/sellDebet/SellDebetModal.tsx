import { useContractorApi } from "@/entities/sale/repository";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Select } from "@/shared/ui/kit";
import { useMemo, useState } from "react";

interface SellDebetModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (data: { contractor_id: any; content: string }) => void;
}

const SellDebetModal = ({
  onCancel,
  onSubmit,
  isOpen,
}: SellDebetModalProps) => {
  const [contragent, setContragent] = useState<{
    contractor_id: number | null;
    content: string;
  }>({
    contractor_id: null,
    content: "",
  });

  const { data, isPending } = useContractorApi(isOpen);

  const contractorOptions = useMemo(() => {
    return (
      data?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) ?? []
    );
  }, [data]);

  const handleSave = () => {
    if (!contragent.contractor_id) showErrorLocalMessage("Выберите клиента");
    onSubmit(contragent);
    setContragent({ contractor_id: null, content: "" });
  };

  return (
    <Dialog
      width={350}
      title="Выбор клиента"
      isOpen={isOpen}
      onClose={onCancel}
    >
      <FormItem labelClass="mb-1" className="pb-1" label="Клиент">
        <Select
          options={contractorOptions}
          size="sm"
          isLoading={isPending}
          className="w-full bg-white"
          placeholder="Клиент"
          value={contractorOptions.find(
            (opt) => opt.value === contragent.contractor_id,
          )}
          getOptionLabel={(option) => option?.label || ""}
          getOptionValue={(option) => String(option?.value)}
          onChange={(val) =>
            setContragent((prev) => ({
              ...prev,
              contractor_id: val?.value ?? null,
            }))
          }
        />
      </FormItem>

      <FormItem label="Комментарий">
        <textarea
          className="w-full border rounded-xl resize-none h-32 px-3 py-2"
          placeholder="Введите комментарий"
          value={contragent.content}
          onChange={(e) =>
            setContragent((prev) => ({ ...prev, content: e.target.value }))
          }
        />
      </FormItem>

      <div className="flex gap-x-2 mt-2">
        <Button onClick={onCancel} className="w-full" size="sm" type="button">
          Отменить
        </Button>
        <Button
          onClick={handleSave} // ❗ to‘g‘ri method
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

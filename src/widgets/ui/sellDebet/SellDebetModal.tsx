import { useContractorApi } from "@/entities/sale/repository";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Select } from "@/shared/ui/kit";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

interface SellDebetModalProps {
  isOpen: boolean;
  contractorId: number | null;
  onCancel: () => void;
  onSubmit: (data: { contractor_id: any; comment: string }) => void;
  setOpenContragentModal: (val: boolean) => void;
  setContractorId: (val: number | null) => void;
}

const SellDebetModal = ({
  onCancel,
  onSubmit,
  isOpen,
  contractorId,
  setOpenContragentModal,
  setContractorId,
}: SellDebetModalProps) => {
  const [contragent, setContragent] = useState<{
    contractor_id: number | null;
    comment: string;
  }>({
    contractor_id: null,
    comment: "",
  });

  const { data, isPending } = useContractorApi(isOpen, "");

  const contractorOptions = useMemo(() => {
    return (
      data?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
      })) ?? []
    );
  }, [data]);

  const handleSave = () => {
    if (!contragent.contractor_id) {
      showErrorLocalMessage("Выберите клиента");
      return;
    }
    onSubmit(contragent);
    setContractorId(null);
    setContragent({ contractor_id: null, comment: "" });
  };

  useEffect(() => {
    if (contractorId) {
      setContragent((prev) => ({
        ...prev,
        contractor_id: contractorId,
      }));
    }
  }, [contractorId]);

  return (
    <Dialog
      width={350}
      title="Выбор клиента"
      isOpen={isOpen}
      onClose={onCancel}
    >
      <FormItem labelClass="mb-1" className="!mb-3" label="Клиент">
        <div className="flex gap-x-1">
          <Select
            options={contractorOptions}
            size="sm"
            isLoading={isPending}
            className="w-full bg-white"
            placeholder="Клиент"
            value={contractorOptions.find(
              (opt: any) => opt.value === contragent.contractor_id,
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
          <Button
            size="sm"
            onClick={() => setOpenContragentModal(true)}
            icon={<FaPlus />}
          />
        </div>
      </FormItem>

      <FormItem label="Комментарий" className="!mb-3">
        <textarea
          className="w-full border rounded-xl resize-none h-32 px-3 py-2"
          placeholder="Введите комментарий"
          value={contragent.comment}
          onChange={(e) =>
            setContragent((prev) => ({ ...prev, comment: e.target.value }))
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

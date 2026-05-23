import { Button, Dialog, Input } from "@/shared/ui/kit";
import { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  setDiscountModal: (isOpen: boolean) => void;
  updateDraftDiscount: (val: string) => void;
  discount?: string;
};

const DiscountModal = ({
  isOpen,
  setDiscountModal,
  updateDraftDiscount,
  discount,
}: ModalProps) => {
  const [value, setValue] = useState<string>(String(discount ?? 0));

  // 🔹 discount o‘zgarganda input qiymatini yangilash.
  useEffect(() => {
    setValue(String(discount ?? 0));
  }, [discount, isOpen]);

  const onClose = () => {
    setDiscountModal(false);
    setValue("0");
  };

  const onSubmit = () => {
    if (value) {
      updateDraftDiscount(value);
    }
    onClose();
  };

  return (
    <Dialog width={490} isOpen={isOpen} onClose={onClose} title="Скидка">
      <Input
        type="number"
        autoFocus
        replaceLeadingZero={true}
        space={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="flex justify-end gap-x-2 mt-6">
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="solid" onClick={onSubmit}>
          Применить
        </Button>
      </div>
    </Dialog>
  );
};

export default DiscountModal;

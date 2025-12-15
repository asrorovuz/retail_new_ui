import { useCashboxApi } from "@/entities/init/repository";
import CashboxCard from "@/features/cashbox-card";
import CashboxFormModal from "@/features/cashbox-form";
import { useState } from "react";

const Cashbox = () => {
  const [type, setType] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data } = useCashboxApi();

  const onCloseModal = () => {
    setIsOpen(false);
    setType(0);
  };

  const onOpenModal = (ind: number) => {
    setIsOpen(true);
    setType(ind);
  };

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh_-_100px)]">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">
        Касса
      </h2>

      <CashboxCard data={data} onOpenModal={onOpenModal} />
      <CashboxFormModal
        isOpen={isOpen}
        type={type}
        onCloseModal={onCloseModal}
        cashbox={data || []}
      />
    </div>
  );
};

export default Cashbox;

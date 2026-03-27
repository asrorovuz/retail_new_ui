import { useCashboxApi } from "@/entities/init/repository";
import CashboxCard from "@/features/cashbox-card";
import CashboxFormModal from "@/features/cashbox-form";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import { useState } from "react";
import CashboxPaymentCard from "./CashboxPaymentCard";
import { Button } from "@/shared/ui/kit";

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

    console.log(data, "data");

    return (
        <div className="bg-white h-full rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
                <NavigateButton content={"Касса"} />
                <Button disabled variant="solid" size="sm">Создать кассу</Button>
            </div>

            <CashboxPaymentCard data={data} />
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

import { useContractorApi } from "@/entities/sale/repository";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Select } from "@/shared/ui/kit";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import FullKeyboard from "../keyboard/FullKeyboard";

interface SellDebetModalProps {
    isOpen: boolean;
    contractorId: number | null;
    onCancel: () => void;
    onSubmit: (data: { contractor_id: any; comment: string }) => void;
    setOpenContragentModal: (val: boolean) => void;
    setContractorId: (val: number | null) => void;
    type: string;
}

const SellDebetModal = ({
    onCancel,
    onSubmit,
    isOpen,
    contractorId,
    setOpenContragentModal,
    type,
}: SellDebetModalProps) => {
    const [contractorIdState, setContractorIdState] = useState<any>(null);
    const [comment, setComment] = useState("");

    const { data, isPending } = useContractorApi(isOpen, "");

    useEffect(() => {
        setContractorIdState(contractorId);
    }, [contractorId]);

    const filterData =
        type === "purchase" ? data?.filter((el: any) => el?.is_supplier) : data;

    const contractorOptions = useMemo(() => {
        return (
            filterData?.map((item: any) => ({
                label: item?.name,
                value: item?.id,
            })) ?? []
        );
    }, [data]);

    const handleSave = () => {
        if (!contractorIdState) {
            showErrorLocalMessage("Выберите клиента");
            return;
        }

        onSubmit({ contractor_id: contractorIdState, comment });
        setComment("")
        setContractorIdState(null)
    };

    return (
        <Dialog
            width={"60vw"}
            title="Выбор клиента"
            isOpen={isOpen}
            onClose={onCancel}
        >
            <FormItem labelClass="mb-1" className="!mb-3" label="Клиент">
                <div className="flex gap-x-1">
                    <Select
                        options={contractorOptions}
                        size="sm"
                        isSearchable={false}
                        isLoading={isPending}
                        className="w-full bg-white"
                        placeholder="Клиент"
                        value={contractorOptions.find(
                            (opt: any) => opt.value === contractorIdState,
                        )}
                        getOptionLabel={(option) => option?.label || ""}
                        getOptionValue={(option) => String(option?.value)}
                        onChange={(val) => setContractorIdState(val?.value)}
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
                    className="w-full border rounded-xl resize-none h-32 px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Введите комментарий"
                    value={comment}
                    inputMode="none"
                    onChange={(e) => setComment(e.target.value)}
                />
            </FormItem>

            <div className="flex gap-x-2 my-2">
                <Button
                    onClick={onCancel}
                    className="w-full"
                    size="sm"
                    type="button"
                >
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
            <FullKeyboard setSearch={setComment} />
        </Dialog>
    );
};

export default SellDebetModal;

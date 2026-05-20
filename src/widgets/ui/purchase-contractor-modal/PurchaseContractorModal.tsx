import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useContractorApi } from "@/entities/sale/repository";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Select } from "@/shared/ui/kit";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

const PurchaseContractorModal = ({
    onCancel,
    onSubmit,
    isOpen,
    contractorId,
    setOpenContragentModal,
}: any) => {
    const [contractorIdState, setContractorIdState] = useState<any>(null);
    const comment = "";

    const { setContractorId } = useDraftPurchaseStore();

    const { data, isPending } = useContractorApi(isOpen, "");

    const contractorOptions = useMemo(() => {
        return (
            data
                ?.filter((el: any) => el?.is_supplier)
                ?.map((item: any) => ({
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
        const contragent = {
            contractor_id: contractorIdState,
            comment,
        };
        onSubmit(contragent);
        setContractorId(contractorId)
        setContractorIdState(null);
    };

    useEffect(() => {
        if (contractorId) {
            setContractorIdState(contractorId);
        }
    }, [contractorId]);

    return (
        <Dialog width={"360px"} closable={false} isOpen={isOpen}>
            <FormItem labelClass="mb-1" className="!mb-3" label="Поставщик">
                <div className="flex gap-x-1">
                    <Select
                        options={contractorOptions}
                        size="sm"
                        isSearchable={false}
                        isLoading={isPending}
                        className="w-full bg-white"
                        placeholder="Поставщик"
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
        </Dialog>
    );
};

export default PurchaseContractorModal;

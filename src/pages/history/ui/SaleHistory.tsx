import {
    useOperationCountApi,
    useSellApi,
    useSellIdApi,
} from "@/entities/history/repository";
import { Filter, TransactionModal } from "@/features/history";
import TableHistory from "@/features/history/ui/Table";
import { usePermission } from "@/shared/lib/controlActionWithPermission";
import { Button, DatePicker, Dialog } from "@/shared/ui/kit";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import Loading from "@/shared/ui/loading";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { VscListFilter } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const SaleHistory = () => {
    const navigate = useNavigate();
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
    const [params, setParams] = useState({
        skip: 0,
        limit: 10,
    });
    const [viewModal, setViewModal] = useState({
        isOpen: false,
        id: null,
    });

    const { control, watch } = useForm({
        defaultValues: {
            date_start: null,
            date_end: null,
        },
    });

    const { checkPermissionByAction } = usePermission();
    const canCreate = checkPermissionByAction("sale", "create");

    const { data, isLoading } = useSellApi(params);
    const { data: dataId, isPending: isLoadingId } = useSellIdApi(
        viewModal?.id,
    );
    const { data: count } = useOperationCountApi(params, "sale");

    const closeModal = () => {
        setViewModal({ isOpen: false, id: null });
    };

    const dateStart = watch("date_start");
    const dateEnd = watch("date_end");

    useEffect(() => {
        setParams((prev: any) => ({
            ...prev,
            date_start: dateStart
                ? dayjs(dateStart).startOf("day").format("YYYY-MM-DD HH:mm:ss")
                : null,
            date_end: dateEnd
                ? dayjs(dateEnd).endOf("day").format("YYYY-MM-DD HH:mm:ss")
                : null,
        }));
    }, [dateStart, dateEnd]);

    return (
        <div className="bg-white h-full rounded-2xl p-4">
            <div className="flex justify-between mb-3">
                <NavigateButton content="История продаж" />
                <div className="flex gap-x-2">
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
                    <Button
                        size="sm"
                        icon={<VscListFilter size={20} />}
                        onClick={() => setIsOpenFilter(!isOpenFilter)}
                    />
                    {canCreate && (
                        <Button
                            icon={<FaPlus />}
                            variant="solid"
                            size="sm"
                            onClick={() => navigate("/sales")}
                        >
                            Добавить
                        </Button>
                    )}
                </div>
            </div>
            <Filter
                type="sale"
                isOpenFilter={isOpenFilter}
                setIsOpenFilter={setIsOpenFilter}
                setParams={setParams}
            />
            <TableHistory
                data={data ?? []}
                count={count}
                loading={isLoading}
                isOpenFilter={isOpenFilter}
                setParams={setParams}
                pay={true}
                setViewModal={setViewModal}
                payKey={"payment"}
                params={params}
                type="sale"
            />
            <Dialog
                onClose={closeModal}
                title={`Продажа № ${dataId?.number}`}
                isOpen={viewModal?.isOpen}
            >
                {!isLoadingId ? (
                    <TransactionModal
                        data={dataId}
                        payKey={"payment"}
                        viewModal={viewModal}
                        type={"sale"}
                    />
                ) : (
                    <div className="h-[70vh]">
                        <Loading />
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default SaleHistory;

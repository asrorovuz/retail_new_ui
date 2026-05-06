import {
    useOperationCountApi,
    useRefundApi,
    useRefundIdApi,
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

const RefundHistory = () => {
    const navigate = useNavigate();
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [params, setParams] = useState({
        pageIndex: 1,
        pageSize: 20,
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
    const canCreate = checkPermissionByAction("refund", "create");

    const { data, isLoading } = useRefundApi(params);
    const { data: dataId, isPending: isLoadingId } = useRefundIdApi(
        viewModal?.id,
    );
    const { data: count } = useOperationCountApi(params, "refund");

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
        <div className="bg-white h-screen rounded-lg p-3 flex flex-col">
            <div className="flex justify-between mb-3">
                <NavigateButton content="История возвратов" />
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
                            onClick={() => navigate("/refund")}
                        >
                            Добавить
                        </Button>
                    )}
                </div>
            </div>

            <Filter
                type="refund"
                isOpenFilter={isOpenFilter}
                setIsOpenFilter={setIsOpenFilter}
                setParams={setParams}
            />

            <TableHistory
                data={data ?? []}
                count={count}
                loading={isLoading}
                setParams={setParams}
                setViewModal={setViewModal}
                pay={true}
                payKey={"payout"}
                params={params}
                type="refund"
            />

            <Dialog
                onClose={closeModal}
                title={`Возврат № ${dataId?.number}`}
                isOpen={viewModal?.isOpen}
            >
                {!isLoadingId ? (
                    <TransactionModal
                        data={dataId}
                        payKey={"payout"}
                        viewModal={viewModal}
                        type={"refund"}
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

export default RefundHistory;

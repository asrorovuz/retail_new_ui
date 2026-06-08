import {
    useRefundIdApi,
    useReturnPurchaseApi,
    useReturnPurchaseCountApi,
} from "@/entities/history/repository";
import { Filter, TransactionModal } from "@/features/history";
import { PaymentTypes } from "@/app/constants/payment.types";
import { useReturnPurchaseDraftStore } from "@/app/store/useReturnPurchaseDraftStore";
import { Button, DatePicker, Dialog } from "@/shared/ui/kit";
import Loading from "@/shared/ui/loading";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { VscListFilter } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import ReturnPurchaseTable from "./ReturnPurchaseTable";

const Tab3 = ({ id }: any) => {
    const navigate = useNavigate();
    const {
        addDraftReturnPurchase,
        draftReturnPurchases,
        activateDraftReturnPurchase,
        setReturnPurchaseContractorId,
    } = useReturnPurchaseDraftStore();

    const onEdit = (data: any) => {
        const items = data?.items?.map((item: any) => ({
            id: item?.id,
            productId: item?.warehouse_operation_from?.product?.id,
            productName: item?.warehouse_operation_from?.product?.name,
            productPackageName: item?.warehouse_operation_from?.product?.package_name,
            priceAmount: item?.price_amount,
            priceTypeId: item?.price_type_id,
            quantity: item?.quantity,
            totalAmount: item?.quantity * item?.price_amount,
            marks: item?.marks,
            catalogCode: item?.warehouse_operation_from?.product?.catalog_code,
            catalogName: item?.warehouse_operation_from?.product?.catalog_name,
        }));
        const cashBoxStates = data?.payout?.cash_box_states || [];
        const paymentAmounts = PaymentTypes?.map((paymentType) => {
            const founded = cashBoxStates?.find((s: any) => s?.type === paymentType?.type);
            return { paymentType: paymentType.type, amount: founded ? founded.amount : 0 };
        });
        const payload = {
            id: data?.id,
            items,
            isActive: true,
            discountAmount: data?.exact_discounts?.[0]?.amount,
            contractor_id: data?.contractor_id ?? null,
            payout: { amounts: paymentAmounts },
        };
        if (!draftReturnPurchases?.some((item) => item.id === data?.id)) {
            addDraftReturnPurchase(payload);
        } else {
            const index = draftReturnPurchases?.findIndex((item) => item?.id === data?.id);
            activateDraftReturnPurchase(index ?? 0);
        }
        setReturnPurchaseContractorId(data?.contractor_id ?? null);
        navigate("/return-purchase");
    };

    const [params, setParams] = useState({
        pageIndex: 1,
        pageSize: 20,
        contractor_id: id,
        date_start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        date_end: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    });
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [viewModal, setViewModal] = useState({
        isOpen: false,
        id: null,
    });

    const { data, isLoading } = useReturnPurchaseApi(params);
    const { data: count } = useReturnPurchaseCountApi(params);
    const { data: dataId, isPending: isLoadingId } = useRefundIdApi(
        viewModal?.id,
    );

    const { control, watch } = useForm({
        defaultValues: {
            date_start: dayjs().startOf("day").toDate(),
            date_end: dayjs().endOf("day").toDate(),
            contractor_id: id,
        },
    });

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
        <div className="bg-white h-full flex-1 rounded-lg p-2 flex flex-col">
            <div className="flex justify-end mb-3">
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
                    <Button
                        icon={<FaPlus />}
                        variant="solid"
                        size="sm"
                        onClick={() => navigate("/return-purchase")}
                    >
                        Добавить
                    </Button>
                </div>
            </div>
            <Filter
                type="refund"
                isOpenFilter={isOpenFilter}
                setIsOpenFilter={setIsOpenFilter}
                setParams={setParams}
                countyparty={true}
            />
            <ReturnPurchaseTable
                data={data ?? []}
                count={count}
                loading={isLoading}
                setParams={setParams}
                setViewModal={setViewModal}
                params={params}
                onEdit={onEdit}
            />

            <Dialog
                onClose={closeModal}
                title={`Возврат № ${dataId?.number}`}
                isOpen={viewModal?.isOpen}
            >
                {!isLoadingId ? (
                    <TransactionModal
                        data={dataId}
                        payKey={"payment"}
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

export default Tab3;

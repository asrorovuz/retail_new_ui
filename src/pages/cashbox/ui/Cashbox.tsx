import { useCashboxApi } from "@/entities/init/repository";
import CashboxCard from "@/features/cashbox-card";
import CashboxFormModal from "@/features/cashbox-form";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import { useState } from "react";
import CashboxPaymentCard from "./CashboxPaymentCard";
import { Button, Dropdown } from "@/shared/ui/kit";
import { FaClipboardList, FaSyncAlt } from "react-icons/fa";
import { MdPrint } from "react-icons/md";
import DropdownItem from "@/shared/ui/kit/Dropdown/DropdownItem";
import { useFescalDeviceApi } from "@/entities/sale/repository";
import {
    useGetCloseZReport,
    useGetOpenZReport,
    useGetPrintXReport,
    useGetSendCheck,
    useGetSyncReport,
} from "@/entities/cashbox/repository";
import { showErrorLocalMessage,showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";

const Cashbox = () => {
    const [type, setType] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data } = useCashboxApi();
    const { data: fiscalData } = useFescalDeviceApi(true);
    const { mutate: printXReportMutate } = useGetPrintXReport();
    const { mutate: openZReportMutate } = useGetOpenZReport();
    const { mutate: closeZReportMutate } = useGetCloseZReport();
    const { mutate: syncReportMutate } = useGetSyncReport();
    const { mutate: syncSendCheckMutate } = useGetSendCheck();

    const onCloseModal = () => {
        setIsOpen(false);
        setType(0);
    };

    const onOpenModal = (ind: number) => {
        setIsOpen(true);
        setType(ind);
    };

    const renderFiscalItems = (type: number) => {
        let mutate;

        switch (type) {
            case 1:
                mutate = printXReportMutate;
                break;
            case 2:
                mutate = syncReportMutate;
                break;
            case 3:
                mutate = openZReportMutate;
                break;
            case 4:
                mutate = closeZReportMutate;
                break;
            case 5:
                mutate = syncSendCheckMutate;
                break;
            default:
                return null;
        }

        const onSubmit = (id: number) => {
            mutate(id, {
                onSuccess() {
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );
                },
                onError() {
                    showErrorLocalMessage("Проверьте терминал или соединение.");
                },
            });
        };

        return fiscalData?.map((item) => (
            <DropdownItem key={item.id} onClick={() => onSubmit(item?.id)}>
                {item?.name}
            </DropdownItem>
        ));
    };

    return (
        <div className="bg-white h-screen flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="mb-2">
                    <NavigateButton content={"Касса"} />
                </div>
                <div className="flex gap-x-1">
                    <Dropdown
                        renderTitle={
                            <Button icon={<FaSyncAlt />} size="sm">
                                Отправка чеков
                            </Button>
                        }
                    >
                        {renderFiscalItems(5)}
                    </Dropdown>
                    <Dropdown
                        renderTitle={
                            <Button icon={<FaSyncAlt />} size="sm">
                                Синх. терминала
                            </Button>
                        }
                    >
                        {renderFiscalItems(2)}
                    </Dropdown>
                    <Dropdown
                        renderTitle={
                            <Button icon={<MdPrint />} size="sm">
                                Распечатать X-отчёт
                            </Button>
                        }
                    >
                        {renderFiscalItems(1)}
                    </Dropdown>
                    <Dropdown
                        renderTitle={
                            <Button icon={<FaClipboardList />} size="sm">
                                Открыть Z-отчёт
                            </Button>
                        }
                    >
                        {renderFiscalItems(3)}
                    </Dropdown>
                    <Dropdown
                        renderTitle={
                            <Button icon={<FaClipboardList />} size="sm">
                                Закрыть Z-отчёт
                            </Button>
                        }
                    >
                        {renderFiscalItems(4)}
                    </Dropdown>

                    {/* <Button disabled variant="solid" size="sm">
                        Создать кассу
                    </Button> */}
                </div>
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

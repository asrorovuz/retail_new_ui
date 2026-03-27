import { Button } from "@/shared/ui/kit";
import { BiTransfer } from "react-icons/bi";
import { BsCashCoin } from "react-icons/bs";
import { IoTrendingDownOutline, IoTrendingUpOutline } from "react-icons/io5";
import { data } from "react-router-dom";

const CashboxCardFooter = ({
    openModal,
}: {
    item: any;
    openModal: (val: number) => void;
}) => {
    return (
        <>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={() => openModal(1)}
                    icon={<IoTrendingUpOutline />}
                    size="sm"
                    variant="default"
                    className="w-full"
                >
                    Входящие
                </Button>
                <Button
                    onClick={() => openModal(2)}
                    icon={<IoTrendingDownOutline />}
                    className="w-full"
                    size="sm"
                    variant="default"
                >
                    Исходящие
                </Button>
                <Button
                    onClick={() => openModal(3)}
                    icon={<BsCashCoin />}
                    className="w-full"
                    size="sm"
                    variant="default"
                >
                    Расход
                </Button>
                <Button
                    // onClick={openModal}
                    disabled={data?.length > 1}
                    icon={<BiTransfer />}
                    className="w-full"
                    size="sm"
                    variant="default"
                >
                    Перевод
                </Button>
            </div>
        </>
    );
};

export default CashboxCardFooter;

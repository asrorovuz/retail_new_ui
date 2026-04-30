import { useCashboxStore } from "@/app/store/useCashbox";
import { Dropdown } from "@/shared/ui/kit";
import { BsCashCoin } from "react-icons/bs";
import { IoTrendingDownOutline, IoTrendingUpOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CashboxDropDown = ({
    button,
    cashbox,
    canViewExpense,
    canViewOut,
    canViewIn,
}: {
    button: React.ReactNode;
    cashbox: any;
    canViewIn: boolean;
    canViewOut: boolean;
    canViewExpense: boolean;
}) => {
    const { setType, setCashbox } = useCashboxStore((state) => state);
    const navigate = useNavigate();

    return (
        <Dropdown renderTitle={button}>
            {" "}
            {canViewIn && (
                <Dropdown.Item
                    eventKey="cash-in"
                    onClick={() => {
                        (navigate("/cashbox/cash-operation"),
                            setType(1),
                            setCashbox(cashbox));
                    }}
                >
                    <IoTrendingUpOutline className={"text-xl"} />
                    <span>Входящие</span>
                </Dropdown.Item>
            )}
            {canViewOut && (
                <Dropdown.Item
                    eventKey="cash-out"
                    onClick={() => {
                        (navigate("/cashbox/cash-operation"),
                            setType(2),
                            setCashbox(cashbox));
                    }}
                >
                    <IoTrendingDownOutline className={"text-xl"} />
                    <span className={"mt-1"}>Исходящие</span>
                </Dropdown.Item>
            )}
            {canViewExpense && (
                <Dropdown.Item
                    eventKey="expense"
                    onClick={() => {
                        (navigate("/cashbox/cash-operation"),
                            setType(3),
                            setCashbox(cashbox));
                    }}
                >
                    <BsCashCoin className={"text-xl"} />
                    Расход
                </Dropdown.Item>
            )}
            {/* <Dropdown.Item
        eventKey="transfer"
        onClick={() => {
            navigate("/cashbox-transfer"), setType(4);
        }}
      >
        <IoTrendingDownOutline className={"text-xl"} />
        <span className={"mt-1"}>Перевод</span>
      </Dropdown.Item> */}
        </Dropdown>
    );
};

export default CashboxDropDown;

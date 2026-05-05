import { Button, Card } from "@/shared/ui/kit";
import Loading from "@/shared/ui/loading";
import { BsThreeDotsVertical } from "react-icons/bs";
import CashboxDropDown from "./CashboxDropDown";
import CurrencyName from "@/shared/lib/CurrencyName";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { paymentTypes } from "@/@types/cashbox";
import CashboxCardFooter from "./CashboxCardFooter";
import { usePermission } from "@/shared/lib/controlActionWithPermission";

const CashboxCard = ({
    data,
    onOpenModal,
}: {
    data: any;
    onOpenModal: (val: number) => void;
}) => {
    const groupedPrice = (data: any[]) =>
        Object.values(
            data.reduce((acc, item) => {
                const { code, name } = item.currency;
                const type = item.money_type;

                acc[code] ??= { currency: { code, name }, moneyType: {} };
                acc[code].moneyType[type] ??= [];
                acc[code].moneyType[type].push(item);

                return acc;
            }, {}),
        );

    const { checkPermissionByAction } = usePermission();
    const canViewIn = checkPermissionByAction("cashIn", "view");
    const canViewOut = checkPermissionByAction("cashOut", "view");
    const canViewExpense = checkPermissionByAction("cashExpense", "view");

    return (
        <div className="grid grid-cols-3 xl:grid-cols-4 flex-1 h-full gap-3 overflow-y-auto">
            {data ? (
                data?.map((item: any) => {
                    return (
                        <>
                            <Card
                                key={item?.id}
                                header={{
                                    content: item?.name,
                                    extra: (canViewIn ||
                                        canViewOut ||
                                        canViewExpense) && (
                                        <CashboxDropDown
                                            cashbox={data}
                                            canViewIn={canViewIn}
                                            canViewOut={canViewOut}
                                            canViewExpense={canViewExpense}
                                            button={
                                                <Button
                                                    variant="plain"
                                                    size="sm"
                                                    className="bg-transparent p-0"
                                                >
                                                    <BsThreeDotsVertical
                                                        size={22}
                                                    />
                                                </Button>
                                            }
                                        />
                                    ),
                                }}
                                footer={{
                                    className: "!px-1",
                                    content: (
                                        <CashboxCardFooter
                                            item={item}
                                            openModal={onOpenModal}
                                        />
                                    ),
                                }}
                            >
                                {groupedPrice(item?.amounts || [])?.map(
                                    (currency: any) => (
                                        <div
                                            key={currency?.currency?.code}
                                            className="font-bold my-5 "
                                        >
                                            {Object.entries(
                                                currency?.moneyType,
                                            )?.map(
                                                (
                                                    [moneyType, amounts]: any,
                                                    index,
                                                ) => {
                                                    const isLast =
                                                        index ===
                                                        Object.entries(
                                                            currency?.moneyType,
                                                        )?.length -
                                                            1;

                                                    return (
                                                        <div key={moneyType}>
                                                            <div className="flex gap-3 py-1 justify-between">
                                                                <span className="text-sm text-slate-500">
                                                                    {
                                                                        paymentTypes[
                                                                            Number(
                                                                                moneyType,
                                                                            )
                                                                        ]
                                                                    }
                                                                    :
                                                                </span>

                                                                {amounts?.map(
                                                                    (
                                                                        amount: any,
                                                                    ) => (
                                                                        <p
                                                                            key={
                                                                                amount.id ||
                                                                                amount.amount
                                                                            }
                                                                            className="heading-text font-bold flex gap-x-1"
                                                                        >
                                                                            <FormattedNumber
                                                                                value={
                                                                                    amount.amount
                                                                                }
                                                                            />
                                                                            <CurrencyName
                                                                                currency={
                                                                                    amount.currency
                                                                                }
                                                                            />
                                                                        </p>
                                                                    ),
                                                                )}
                                                            </div>

                                                            {!isLast && (
                                                                <hr className="my-1 w-full" />
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ),
                                )}
                            </Card>
                        </>
                    );
                })
            ) : (
                <div className="h-[20vh] flex items-center justify-center">
                    <Loading />
                </div>
            )}
        </div>
    );
};

export default CashboxCard;

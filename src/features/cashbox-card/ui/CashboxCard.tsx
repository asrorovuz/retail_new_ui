import { Button, Card } from "@/shared/ui/kit";
import Loading from "@/shared/ui/loading";
import { BsThreeDotsVertical } from "react-icons/bs";
import CashboxDropDown from "./CashboxDropDown";
import CurrencyName from "@/shared/lib/CurrencyName";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { paymentTypes } from "@/@types/cashbox";
import CashboxCardFooter from "./CashboxCardFooter";

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
      }, {})
    );

  return (
    <>
      {data ? (
        data?.map((item: any) => {
          return (
            <Card
              key={item?.id}
              className="w-[360px]"
              header={{
                content: item?.name,
                extra: (
                  <CashboxDropDown
                    cashbox={data}
                    button={
                      <Button variant="plain" className="bg-transparent p-0">
                        <BsThreeDotsVertical size={22} />
                      </Button>
                    }
                  />
                ),
              }}
              footer={{
                content: (
                  <CashboxCardFooter item={item} openModal={onOpenModal} />
                ),
              }}
            >
              {groupedPrice(item?.amounts || [])?.map((currency: any) => (
                <div key={currency?.currency?.code} className="font-bold mb-5">
                  <div className="mt-4 mb-1 flex items-center gap-2">
                    Оплата:
                    <CurrencyName currency={currency.currency} />
                  </div>

                  {Object.entries(currency?.moneyType)?.map(
                    ([moneyType, amounts]: any, index) => {
                      const isLast =
                        index ===
                        Object.entries(currency?.moneyType)?.length - 1;

                      return (
                        <div key={moneyType}>
                          <div className="ml-4 flex gap-5">
                            <span className="text-sm text-gray-500">
                              {paymentTypes[Number(moneyType)]}:
                            </span>

                            {amounts?.map((amount: any) => (
                              <p
                                key={amount.id || amount.amount}
                                className="heading-text font-bold"
                              >
                                <FormattedNumber value={amount.amount} />
                                <CurrencyName currency={amount.currency} />
                              </p>
                            ))}
                          </div>

                          {!isLast && <hr className="my-1 w-full" />}
                        </div>
                      );
                    }
                  )}
                </div>
              ))}
            </Card>
          );
        })
      ) : (
        <div className="h-[20vh] flex items-center justify-center">
          <Loading />
        </div>
      )}
    </>
  );
};

export default CashboxCard;

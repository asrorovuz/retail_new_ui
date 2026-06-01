import { useSaleByIdApi } from "@/entities/sale/repository";
import { formattedPhone } from "@/shared/lib/formatedPhone";
import { Card } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import dayjs from "dayjs";

const Tab1 = ({ data, id }: any) => {
    const { data: byIdData } = useSaleByIdApi(id);

    const debts = data?.debts?.reduce(
        (sum: any, acc: any) => sum + acc?.amount,
        0,
    );

    console.log(byIdData, data);

    return (
        <div className="grid grid-cols-5 gap-x-2">
            <Card className="p-3 col-span-2">
                <div className="text-xl text-slate-800 border-b mb-2 pb-2">
                    Долг:{" "}
                    <span className="bg-red-300 rounded-md p-1">
                        <FormattedNumber value={debts} scale={2} />
                    </span>
                </div>
                <ul className="flex flex-col gap-3 uppercase text-slate-800">
                    <li className="flex gap-x-2 justify-between">
                        ТИП:{" "}
                        <div className="flex gap-x-2">
                            {data?.is_customer && (
                                <span className="text-xs px-2 py-0.5 rounded-full w-fit font-medium bg-orange-100 text-orange-700">
                                    Клиент
                                </span>
                            )}{" "}
                            {data?.is_supplier && (
                                <span className="text-xs px-2 py-0.5 rounded-full w-fit font-medium bg-blue-100 text-blue-700">
                                    Поставщик
                                </span>
                            )}
                        </div>
                    </li>
                    <li className="flex gap-x-2 justify-between">
                        Телефонный номер:{" "}
                        <div className="flex flex-col gap-1">
                            {data?.contacts?.length
                                ? data?.contacts?.map((item: any) => {
                                      return (
                                          <span>
                                              {formattedPhone(item?.value)}
                                          </span>
                                      );
                                  })
                                : "--:--"}
                        </div>
                    </li>
                    <li className="flex gap-x-2 justify-between">
                        Дата создания
                        <span>
                            {dayjs(data?.created_at).format("YYYY-MM-DD HH:mm")}
                        </span>
                    </li>
                </ul>
            </Card>

            <Card className="p-3 col-span-3">
                <div className="text-xl text-slate-800 border-b mb-2 pb-2">
                    Статистика по продажам
                </div>

                <div>
                    <div>
                        Umumiy foyda:
                        {/* <span>{data}</span> */}
                    </div>
                    <div></div>
                    <div></div>
                </div>
            </Card>
        </div>
    );
};

export default Tab1;

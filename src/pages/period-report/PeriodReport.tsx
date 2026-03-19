import { Tabs } from "@/shared/ui/kit";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import AllReport from "./AllReport";
// import { useState } from "react";
import dayjs from "dayjs";
import { useSellTransferApi } from "@/entities/sale/repository";
import ProductReport from "./ProductReport";
import ContractorReport from "./ContractorReport";
import Loading from "@/shared/ui/loading";

const PeriodReport = () => {
    // const [params, setParams] = useState({
    //     start_date: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
    //     end_date: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
    //     contractor_id: null,
    // });
    const params = {
        start_date: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
        end_date: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
        contractor_id: null,
    }

    const { data, isPending } = useSellTransferApi(params);

    return (
        <div className="bg-white h-full rounded-2xl p-4">
            <NavigateButton content="Отчет за период" />
            <Tabs variant="pill" defaultValue="tab1">
                <Tabs.TabList className="mb-4">
                    <Tabs.TabNav className="active:bg-blue-200" value="tab1">
                        Общие отчёты
                    </Tabs.TabNav>
                    <Tabs.TabNav value="tab2">
                        Отчёт по товарам за период
                    </Tabs.TabNav>
                    <Tabs.TabNav value="tab3">
                        Отчёт по контрагентам за период
                    </Tabs.TabNav>
                </Tabs.TabList>

                <Tabs.TabContent value="tab1">
                    {isPending ? (
                        <div className="h-40 flex items-center justify-center">
                            <Loading/>
                        </div>
                    ) : (
                        <AllReport data={data?.report} />
                    )}
                </Tabs.TabContent>

                <Tabs.TabContent value="tab2">
                    {isPending ? (
                        <div className="h-40 flex items-center justify-center">
                            <Loading/>
                        </div>
                    ) : (
                        <ProductReport data={data?.report ?? []} />
                    )}
                </Tabs.TabContent>

                <Tabs.TabContent value="tab3">
                    {isPending ? (
                        <div className="h-40 flex items-center justify-center">
                            <Loading/>
                        </div>
                    ) : (
                        <ContractorReport data={data?.report ?? []} />
                    )}
                </Tabs.TabContent>
            </Tabs>
        </div>
    );
};

export default PeriodReport;

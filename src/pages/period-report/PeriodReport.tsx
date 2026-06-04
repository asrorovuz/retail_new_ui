import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import AllReport from "./AllReport";
import { useState } from "react";
import dayjs from "dayjs";
import { useSellTransferApi } from "@/entities/sale/repository";
import ProductReport from "./ProductReport";
// import ContractorReport from "./ContractorReport";
import Loading from "@/shared/ui/loading";

const tabs = [
    { value: "tab1", label: "Общие отчёты" },
    { value: "tab2", label: "Отчёт по товарам за период" },
    // { value: "tab3", label: "Отчёт по контрагентам за период" },
];

const PeriodReport = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    const params = {
        start_date: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
        end_date: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
        contractor_id: null,
    };

    const { data, isPending } = useSellTransferApi(params);

    const renderContent = () => {
        if (isPending) {
            return (
                <div className="h-40 flex items-center justify-center">
                    <Loading />
                </div>
            );
        }

        if (activeTab === "tab1") return <AllReport data={data?.report} />;
        if (activeTab === "tab2")
            return <ProductReport data={data?.report ?? []} />;
        // if (activeTab === "tab3")
        //     return <ContractorReport data={data?.report ?? []} />;
    };

    return (
        <div className="bg-white h-screen p-3">
            <div className="mb-3">
                <NavigateButton content="Отчет за период" />
            </div>

            {/* Tab List */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {tabs.map((tab) => (
                    <div
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors
                            ${
                                activeTab === tab.value
                                    ? "bg-blue-400 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            <div className="h-[calc(100vh-130px)] flex flex-col">{renderContent()}</div>
        </div>
    );
};

export default PeriodReport;

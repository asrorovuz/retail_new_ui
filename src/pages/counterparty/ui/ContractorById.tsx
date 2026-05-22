import { useContragentByIdApi } from "@/entities/history/repository";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import Loading from "@/shared/ui/loading";
import { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { useParams } from "react-router-dom";
import { GoArrowDown } from "react-icons/go";
import { SlReload } from "react-icons/sl";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { CgArrowsExchange } from "react-icons/cg";
import Tab1 from "./tab-items/Tab1";

const tabs = [
    {
        value: "tab1",
        label: (
            <div className="flex items-center gap-x-1 w-max">
                {" "}
                <IoMdPerson /> Общий
            </div>
        ),
    },
    {
        value: "tab2",
        label: (
            <div className="flex items-center gap-x-1 w-max">
                <GoArrowDown /> Поступления
            </div>
        ),
    },
    {
        value: "tab3",
        label: (
            <div className="flex items-center gap-x-1 w-max">
                <SlReload /> Возвраты поставщику
            </div>
        ),
    },
    {
        value: "tab4",
        label: (
            <div className="flex items-center gap-x-1 w-max">
                <FaMoneyCheckDollar /> Оплаты поступлений
            </div>
        ),
    },
    {
        value: "tab5",
        label: (
            <div className="flex items-center gap-x-1 w-max">
                <FaMoneyCheckDollar /> Расходные платежи
            </div>
        ),
    },
    {
        value: "tab6",
        label: (
            <div className="flex items-center gap-x-1 w-max">
                <CgArrowsExchange /> Операции
            </div>
        ),
    },
    {
        value: "tab7",
        label: (
            <div className="flex items-center gap-x-1 w-max">
                <CgArrowsExchange /> Акт сверки расчетов
            </div>
        ),
    },
];

const ContractorById = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const { id } = useParams();

    const { data, isPending } = useContragentByIdApi(Number(id));    

    const renderContent = () => {
        if (isPending) {
            return (
                <div className="h-40 flex items-center justify-center">
                    <Loading />
                </div>
            );
        }

        if (activeTab === "tab1") return <Tab1 data={data} />;
        if (activeTab === "tab2") return <></>;
        if (activeTab === "tab3") return <></>;
        if (activeTab === "tab4") return <></>;
        if (activeTab === "tab5") return <></>;
        if (activeTab === "tab6") return <></>;
        if (activeTab === "tab7") return <></>;
    };

    return (
        <div className="h-screen w-screen p-3 flex flex-col bg-slate-200">
            <div className="mb-4">
                <NavigateButton content={data?.name} />
            </div>

            <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-2 mb-4">
                    {tabs?.map((tab) => (
                        <div
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors whitespace-nowrap
                ${
                    activeTab === tab.value
                        ? "bg-blue-400 text-white"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold"
                }`}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-[calc(100vh-130px)]">{renderContent()}</div>
        </div>
    );
};

export default ContractorById;

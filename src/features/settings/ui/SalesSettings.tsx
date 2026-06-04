import { Radio } from "@/shared/ui/kit";
import {
    useSaleSettingsStore,
    type PriceDisplayMode,
} from "@/app/store/useSaleSettingsStore";

const PRICE_OPTIONS: { value: PriceDisplayMode; label: string; description: string }[] = [
    {
        value: "both",
        label: "Оба варианта",
        description: "В таблице поиска отображается цена продажи и оптовая цена",
    },
    {
        value: "retail",
        label: "Только цена продажи",
        description: "В таблице поиска отображается только цена продажи",
    },
    {
        value: "bulk",
        label: "Только оптовая цена",
        description: "В таблице поиска отображается только оптовая цена",
    },
];

const SalesSettings = () => {
    const { priceDisplayMode, setPriceDisplayMode } = useSaleSettingsStore();

    return (
        <div className="p-3">
            <div className="bg-white rounded-lg border p-4">
                <h3 className="text-base font-medium mb-1">
                    Отображение цены в поиске
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                    Выберите, какие цены показывать при поиске товара на
                    страницах продажи и возврата.
                </p>
                <div className="flex flex-col gap-y-3">
                    {PRICE_OPTIONS.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-start gap-x-3 cursor-pointer p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                            onClick={() => setPriceDisplayMode(opt.value)}
                        >
                            <Radio
                                value={opt.value}
                                name="priceDisplayMode"
                                checked={priceDisplayMode === opt.value}
                                onChange={() => setPriceDisplayMode(opt.value)}
                                className="mt-0.5"
                            />
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {opt.label}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {opt.description}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesSettings;

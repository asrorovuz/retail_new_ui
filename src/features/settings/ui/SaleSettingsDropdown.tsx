import { Dropdown, Radio } from "@/shared/ui/kit";
import {
    useSaleSettingsStore,
    type PriceDisplayMode,
} from "@/app/store/useSaleSettingsStore";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";

const PRICE_OPTIONS: { value: PriceDisplayMode; label: string }[] = [
    { value: "both", label: "Иккала нарх" },
    { value: "retail", label: "Фақат соtuv нархи" },
    { value: "bulk", label: "Фақат bulk нарх" },
];

const SaleSettingsDropdown = () => {
    const { priceDisplayMode, setPriceDisplayMode } = useSaleSettingsStore();

    return (
        <Dropdown
            trigger="click"
            placement="bottom-end"
            renderTitle={
                <button
                    type="button"
                    className="flex items-center justify-center h-10 px-3 rounded-lg text-sm font-medium bg-slate-200 hover:bg-slate-300 text-slate-800 transition whitespace-nowrap"
                >
                    <IoSettingsOutline size={18} />
                </button>
            }
            menuClass="p-2 min-w-[220px]"
        >
            <Dropdown.Item variant="custom">
                <Link
                    to="/settings"
                    className="flex items-center gap-x-2 px-2 py-2 rounded hover:bg-slate-100 text-sm text-slate-700 w-full"
                >
                    <IoSettingsOutline size={16} />
                    Настройки
                </Link>
            </Dropdown.Item>

            <Dropdown.Item variant="divider" />

            <Dropdown.Item variant="header">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 py-1">
                    Savdo sozlamalari
                </p>
            </Dropdown.Item>

            {PRICE_OPTIONS.map((opt) => (
                <Dropdown.Item
                    key={opt.value}
                    variant="custom"
                    onClick={() => setPriceDisplayMode(opt.value)}
                >
                    <label className="flex items-center gap-x-2 px-2 py-2 cursor-pointer hover:bg-slate-100 rounded w-full text-sm text-slate-700">
                        <Radio
                            value={opt.value}
                            name="priceDisplayMode"
                            checked={priceDisplayMode === opt.value}
                            onChange={() => setPriceDisplayMode(opt.value)}
                        />
                        {opt.label}
                    </label>
                </Dropdown.Item>
            ))}
        </Dropdown>
    );
};

export default SaleSettingsDropdown;

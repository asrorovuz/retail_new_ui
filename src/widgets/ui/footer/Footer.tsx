import { useAuthContext } from "@/app/providers/AuthProvider";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
    useSaleSettingsStore,
    type PriceDisplayMode,
} from "@/app/store/useSaleSettingsStore";
import { useShiftApi } from "@/entities/init/repository";
import { CreateShiftDialog, UpdateShiftDialog } from "@/features/shift";
import { Button, Dropdown, Radio } from "@/shared/ui/kit";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import { LogoutSvg } from "@/shared/ui/svg/LogoutSvg";
import { useEffect, useState } from "react";
import { MdOutlineSettings } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import { Link, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = ({ deleteDraft, draft }: any) => {
    const [showAlert, setShowAlert] = useState(false);
    const [showWindow, setShowWindow] = useState(false);
    const [shiftAddModal, setShiftAddModal] = useState(false);
    const [shiftUpdateModal, setShiftUpdateModal] = useState(false);
    const [pendingLogout, setPendingLogout] = useState(false);
    const { data, error } = useShiftApi(shiftAddModal || shiftUpdateModal);
    const { logout } = useAuthContext();
    const { t } = useTranslation();
    const setIsOpenNavigate =
        useOutletContext<React.Dispatch<React.SetStateAction<boolean>>>();

    const { activeShift, setActiveShift, pendingShiftOpen, setPendingShiftOpen } = useSettingsStore();
    const { priceDisplayMode, setPriceDisplayMode } = useSaleSettingsStore();

    const PRICE_OPTIONS: { value: PriceDisplayMode; label: string }[] = [
        { value: "both", label: t("footer.priceMode.both") },
        { value: "retail", label: t("footer.priceMode.retail") },
        { value: "bulk", label: t("footer.priceMode.bulk") },
    ];

    const onDeleteActivedraft = () => {
        const findIndex = draft?.findIndex((item: any) => item?.isActive);
        deleteDraft(findIndex);
        setShowWindow(false);
    };

    useEffect(() => {
        if (!!error) setActiveShift(null);
        else if (data) setActiveShift(data);
        else setActiveShift(null);
    }, [data, error, setActiveShift]);

    useEffect(() => {
        if (pendingShiftOpen) {
            setShiftAddModal(true);
            setPendingShiftOpen(false);
        }
    }, [pendingShiftOpen]);

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
                <Button
                    onClick={() => setShowAlert(true)}
                    className="bg-red-100 h-8 text-red-500 text-xs font-semibold active:bg-red-200 active:text-red-500 hover:text-red-500 transition duration-300"
                    variant="plain"
                    size="sm"
                    icon={<LogoutSvg height={20} width={20} />}
                >
                    {t("footer.logout")}
                </Button>
                <Button
                    variant="default"
                    type="button"
                    size="sm"
                    onClick={() => setShowWindow(true)}
                    className="!text-red-500 h-8 py-0 ring-0 hover:ring-0 active:ring-0 hover:border-red-500 active:border-red-500 active:text-red-600"
                >
                    {t("footer.deleteWindow")}
                </Button>
            </div>
            <div className="flex items-center gap-x-2">
                <Dropdown
                    trigger="click"
                    placement="top-start"
                    renderTitle={
                        <Button
                            size="xs"
                            icon={<MdOutlineSettings />}
                        />
                    }
                    menuClass="p-2 min-w-[220px]"
                >
                    <Dropdown.Item variant="custom">
                        <Link
                            to="/settings"
                            className="flex items-center gap-x-2 px-2 py-2 rounded hover:bg-slate-100 text-sm text-slate-700 w-full"
                        >
                            <MdOutlineSettings size={15} />
                            {t("footer.settings")}
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item variant="divider" />
                    <Dropdown.Item variant="header">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 py-1">
                            {t("footer.saleSettings")}
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
                                    name="footerPriceMode"
                                    checked={priceDisplayMode === opt.value}
                                    onChange={() =>
                                        setPriceDisplayMode(opt.value)
                                    }
                                />
                                {opt.label}
                            </label>
                        </Dropdown.Item>
                    ))}
                </Dropdown>

                <Button
                    onClick={() => setIsOpenNavigate(true)}
                    className="h-8 py-0"
                    size="sm"
                    type="button"
                >
                    {t("footer.others")}
                </Button>
                <div className="relative">
                    <Button
                        className="h-8 py-0"
                        size="sm"
                        onClick={() =>
                            activeShift
                                ? setShiftUpdateModal(true)
                                : setShiftAddModal(true)
                        }
                        icon={<TfiReload />}
                        variant="solid"
                        type="button"
                    >
                        {t("footer.shift")}
                    </Button>
                    {activeShift && (
                        <span className="absolute -top-1 -right-1 block size-3 rounded-full bg-green-500 border border-white" />
                    )}
                </div>
            </div>
            {showAlert && (
                <Alert
                    type="warning"
                    title={t("alert.logoutTitle")}
                    content={t("alert.logoutContent")}
                    onCancel={() => setShowAlert(false)}
                    onConfirm={() => {
                        setShowAlert(false);
                        if (activeShift) {
                            setPendingLogout(true);
                            setShiftUpdateModal(true);
                        } else {
                            logout();
                        }
                    }}
                />
            )}

            {showWindow && (
                <Alert
                    type="warning"
                    title={t("alert.closeWindowTitle")}
                    content={t("alert.closeWindowContent")}
                    onCancel={() => setShowWindow(false)}
                    onConfirm={onDeleteActivedraft}
                />
            )}

            <CreateShiftDialog
                isOpen={shiftAddModal}
                onClose={() => {
                    setShiftUpdateModal(false);
                    setShiftAddModal(false);
                }}
            />

            <UpdateShiftDialog
                isOpen={shiftUpdateModal}
                onClose={() => {
                    setShiftUpdateModal(false);
                    setShiftAddModal(false);
                    setPendingLogout(false);
                }}
                onShiftClosed={pendingLogout ? logout : undefined}
            />
        </div>
    );
};

export default Footer;

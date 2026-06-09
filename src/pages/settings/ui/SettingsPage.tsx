import { AccountPermissions } from "@/app/constants/permissions";
import { PaymentSection } from "@/features/payment";
import DeviceSettings from "@/features/settings/ui/DeviceSettings";
import FiscalizationSettings from "@/features/settings/ui/FiscalSettings";
import OtherSettings from "@/features/settings/ui/OtherSettings";
import TelegramBot from "@/features/settings/ui/TelegramBot";
import { useCheckPermission } from "@/shared/lib/checkPermission";
import { Tabs } from "@/shared/ui/kit";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
    const checkPermission = useCheckPermission();
    const { t } = useTranslation();

    return (
        <div className="h-screen overflow-hidden bg-white flex flex-col">
            <div className="px-3 pt-3 pb-1 shrink-0">
                <NavigateButton content={t("settings.title")} />
            </div>
            <Tabs
                defaultValue="devices"
                variant="pill"
                className="flex flex-col flex-1 overflow-hidden"
            >
                <Tabs.TabList className="px-3 shrink-0 border-b border-slate-100">
                    <Tabs.TabNav value="devices">{t("settings.devices")}</Tabs.TabNav>
                    <Tabs.TabNav value="integration">{t("settings.integration")}</Tabs.TabNav>
                    <Tabs.TabNav value="other">{t("settings.other")}</Tabs.TabNav>
                </Tabs.TabList>

                <div className="flex-1 overflow-y-auto">
                    <Tabs.TabContent value="devices">
                        <DeviceSettings />
                    </Tabs.TabContent>

                    <Tabs.TabContent value="integration">
                        <div className="flex flex-col gap-y-5 p-3">
                            <FiscalizationSettings />
                            <PaymentSection />
                            {checkPermission(
                                AccountPermissions.AccountPermissionTelegramBotView,
                            ) && <TelegramBot />}
                        </div>
                    </Tabs.TabContent>

                    <Tabs.TabContent value="other">
                        <OtherSettings />
                    </Tabs.TabContent>
                </div>
            </Tabs>
        </div>
    );
};

export default SettingsPage;

import { AccountPermissions } from "@/app/constants/permissions";
import { PaymentSection } from "@/features/payment";
import FiscalizationSettings from "@/features/settings/ui/FiscalSettings";
import MainSettingsPage from "@/features/settings/ui/MainSettings";
import TelegramBot from "@/features/settings/ui/TelegramBot";
import { useCheckPermission } from "@/shared/lib/checkPermission";

const SettingsPage = () => {
    const checkPermission = useCheckPermission();

    return (
        <div className=" h-[calc(100vh-24px)] rounded-2xl overflow-hidden">
            <div className="flex flex-col h-full gap-y-5 overflow-y-auto p-3">
                <MainSettingsPage />
                <FiscalizationSettings />
                <PaymentSection />
                {checkPermission(
                    AccountPermissions.AccountPermissionTelegramBotView,
                ) && <TelegramBot />}
            </div>
        </div>
    );
};

export default SettingsPage;

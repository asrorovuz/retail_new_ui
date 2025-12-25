import FiscalizationSettings from "@/features/settings/ui/FiscalSettings";
import MainSettingsPage from "@/features/settings/ui/MainSettings";
import TelegramBot from "@/features/settings/ui/TelegramBot";

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-y-5 overflow-y-auto">
      <MainSettingsPage/>
      <FiscalizationSettings/>
      <TelegramBot/>
    </div>
  );
};

export default SettingsPage;

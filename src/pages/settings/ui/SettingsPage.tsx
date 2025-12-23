import FiscalizationSettings from "@/features/settings/ui/FiscalSettings";
import MainSettingsPage from "@/features/settings/ui/MainSettings";

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-y-5 overflow-y-auto">
      <MainSettingsPage/>
      <FiscalizationSettings/>
    </div>
  );
};

export default SettingsPage;

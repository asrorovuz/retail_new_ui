import { Card } from "@/shared/ui/kit";
import { useTranslation } from "react-i18next";

const InfoGrid = ({ data }: { data: any }) => {
  const { t } = useTranslation();

  const infoItems = [
    {
      label: t("counterparty.title"),
      value: data?.employee?.name ?? t("common.notFound"),
      icon: "👤",
    },
    {
      label: t("cashbox.cashbox"),
      value: data?.cash_box?.name ?? t("common.notFound"),
      icon: "💰",
    },
    {
      label: t("common.date"),
      value: data?.date
        ? new Date(data.date).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : t("common.notFound"),
      icon: "📅",
    },
    {
      label: t("common.employee"),
      value: data?.employee?.name ?? t("common.notFound"),
      icon: "👔",
    },
  ];

  return (
    <div className="mb-6">
      <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
        <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-2xl">ℹ️</span>
          {t("sale.sale")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems?.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {item.label}
                </span>
                <p className="text-base font-semibold text-slate-800 mt-1">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InfoGrid;

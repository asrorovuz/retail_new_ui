import classNames from "@/shared/lib/classNames";
import { Card } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { useTranslation } from "react-i18next";

const TotalsBlock = ({ data, payKey }: { data: any, payKey: any }) => {
  const { t } = useTranslation();

  const totalItems = [
    {
      label: t("common.total"),
      value: data?.totals?.[0]?.amount ?? 0,
      currency: data?.totals?.[0]?.currency?.name,
      bg: "bg-gradient-to-r from-green-100 to-green-200",
      textColor: "text-green-800",
      icon: "💵",
    },
    {
      label: t("sale.discount"),
      value: data?.exact_discounts?.[0]?.amount ?? 0,
      bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
      textColor: "text-yellow-800",
      icon: "🏷️",
    },
    {
      label: t("common.total"),
      value: data?.net_price?.[0]?.amount ?? 0,
      currency: data?.totals?.[0]?.currency?.name,
      bg: "bg-gradient-to-r from-emerald-100 to-emerald-200",
      textColor: "text-emerald-800",
      icon: "✅",
    },
    {
      label: t("sale.payment"),
      value: data?.[payKey]?.debt_states?.[0]?.amount ?? 0,
      currency: data?.[payKey]?.debt_states?.[0]?.currency?.name,
      bg: "bg-gradient-to-r from-blue-100 to-blue-200",
      textColor: "text-blue-800",
      icon: "💳",
    },
    {
      label: t("sale.debt"),
      value: data?.debts?.[0]?.amount ?? 0,
      currency: data?.debts?.[0]?.currency?.name,
      bg: "bg-gradient-to-r from-red-100 to-red-200",
      textColor: "text-red-800",
      icon: "⚠️",
    },
  ];

  return (
    <div className="mb-6">
      <Card className="p-6 shadow-md">
        <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-2xl">🧮</span>
          {t("report.salesReport")}
        </h4>
        <div className="space-y-3">
          {totalItems?.map((item, index) => (
            <div
              key={index}
              className={classNames(
                "flex items-center justify-between p-4 rounded-lg shadow-sm",
                item.bg
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span
                  className={classNames(
                    "font-semibold text-base",
                    item.textColor
                  )}
                >
                  {item.label}:
                </span>
              </div>
              <div className={classNames("font-bold text-lg", item.textColor)}>
                {typeof item.value === "number" ? (
                  <FormattedNumber value={item.value} />
                ) : (
                  item.value
                )}{" "}
                {item.currency && (
                  <span className="text-sm font-medium">{item.currency}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TotalsBlock;

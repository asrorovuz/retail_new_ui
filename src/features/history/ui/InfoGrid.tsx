import { Card } from "@/shared/ui/kit";

const InfoGrid = ({ data }: { data: any }) => {
  const infoItems = [
    {
      label: "Клиент",
      value: data?.employee?.name ?? "Не указан",
      icon: "👤",
    },
    {
      label: "Касса",
      value: data?.cash_box?.name ?? "Не указана",
      icon: "💰",
    },
    {
      label: "Дата продажи",
      value: data?.date
        ? new Date(data.date).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "Не указана",
      icon: "📅",
    },
    {
      label: "Сотрудник",
      value: data?.employee?.name ?? "Не указан",
      icon: "👔",
    },
  ];

  return (
    <div className="mb-6">
      <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="text-2xl">ℹ️</span>
          Информация о продаже
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems?.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {item.label}
                </span>
                <p className="text-base font-semibold text-gray-800 mt-1">
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

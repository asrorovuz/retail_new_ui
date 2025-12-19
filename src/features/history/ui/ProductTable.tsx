import { Card } from "@/shared/ui/kit";
import { FaBox } from "react-icons/fa";
import TableRow from "./TableRow";

const ProductTable = ({
  items,
  totals,
  packagesCount,
}: {
  items: any[];
  totals: any[];
  packagesCount: number;
}) => {
  return (
    <div className="mb-6">
      <Card className="overflow-hidden shadow-md">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaBox className="text-blue-600" />
            Товары ({items.length})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "#",
                  "Наименование",
                  "Кол-во",
                  "Ед.изм.",
                  // "В упак.",
                  "Упаковка",
                  "Цена",
                  "Скидка",
                  "Цена со скидкой",
                  "Сумма",
                  "Склад",
                ]?.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item, i) => (
                <TableRow
                  key={item?.id}
                  item={item}
                  index={i}
                  totals={totals}
                />
              ))}
            </tbody>
            <tfoot className="bg-blue-50">
              <tr className="font-semibold">
                <td colSpan={2} className="px-4 py-3 text-right text-gray-700">
                  Итого:
                </td>
                <td className="px-4 py-3 text-center text-blue-700 font-bold">
                  {totals?.[0]?.amount ?? packagesCount}
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-center text-blue-700 font-bold">
                  {packagesCount}
                </td>
                <td colSpan={6}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProductTable;

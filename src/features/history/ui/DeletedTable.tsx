import { FaTrash } from "react-icons/fa";
import TableRow from "./TableRow";
import { Card } from "@/shared/ui/kit";

const DeletedTable = ({
  items,
  deletedTotals,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  deletedTotals: number;
}) => {
  return (
    <div className="mb-6">
      <Card className="overflow-hidden shadow-md border-2 border-red-200">
        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
          <h4 className="text-lg font-semibold text-red-800 flex items-center gap-2">
            <FaTrash className="text-red-600" />
            Удалённые товары ({items.length})
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
                  "В упак.",
                  "Упаковка",
                  "Цена",
                  "Сумма",
                  "Склад",
                ].map((h) => (
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
              {items.map((item, i) => (
                <TableRow
                  key={item?.id}
                  isDeleted
                  index={i}
                  item={item}
                  totals={[]}
                />
              ))}
            </tbody>
            <tfoot className="bg-red-50">
              <tr className="font-semibold">
                <td colSpan={2} className="px-4 py-3 text-right text-gray-700">
                  Итого удалённых:
                </td>
                <td className="px-4 py-3 text-center text-red-700 font-bold">
                  {deletedTotals}
                </td>
                <td className="px-4 py-3"></td>
                {/* <td className="px-4 py-3 text-center text-red-700 font-bold">
                  {deletedPackagesCount}
                </td> */}
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DeletedTable;

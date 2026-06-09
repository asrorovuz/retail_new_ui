import { Card } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { FaBox } from "react-icons/fa";
import TableRow from "./TableRow";
import { useTranslation } from "react-i18next";

const ProductTable = ({
  items,
  totals,
  discount,
}: {
  items: any[];
  totals: any[];
  discount: any;
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <Card className="overflow-hidden shadow-md">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FaBox className="text-blue-600" />
            {t("product.products")} ({items.length})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                {[
                  "#",
                  t("common.name"),
                  t("common.quantity"),
                  t("product.unit"),
                  t("common.price"),
                  t("sale.discount"),
                  t("common.total"),
                  t("common.amount"),
                  t("common.supplier"),
                ]?.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items?.map((item, i) => (
                <TableRow key={item?.id} item={item} index={i} />
              ))}
            </tbody>
            <tfoot className="bg-blue-50">
              <tr className="font-semibold">
                <td colSpan={1} className="px-4 py-3 text-right text-slate-700">
                  {t("common.total")}:
                </td>
                <td className="px-4 py-3 text-center text-blue-700 font-bold">
                  <FormattedNumber value={totals?.[0]?.amount ?? 0} />
                </td>
                <td colSpan={2} className="px-4 py-3 text-right text-slate-700">
                  {t("common.total")}:
                </td>
                <td className="px-4 py-3 text-center text-blue-700 font-bold">
                  <FormattedNumber value={(totals?.[0]?.amount - discount?.amount) || 0} />
                </td>
                <td colSpan={1} className="px-4 py-3 text-right text-slate-700">
                  {t("sale.discount")}:
                </td>
                <td className="px-4 py-3 text-center text-blue-700 font-bold">
                  <FormattedNumber value={discount?.amount ?? 0} />
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProductTable;

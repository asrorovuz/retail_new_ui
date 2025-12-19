/* eslint-disable @typescript-eslint/no-explicit-any */

import classNames from "@/shared/lib/classNames";
import CurrencyName from "@/shared/lib/CurrencyName";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";

const TableRow = ({
  item,
  index,
  totals,
  isDeleted,
}: {
  item: any;
  index: number;
  totals: any[];
  isDeleted?: boolean;
}) => {
  const productPackage = item?.warehouse_operation_from?.product;

  return (
    <tr
      className={classNames(
        "transition-colors",
        isDeleted ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
      )}
    >
      <td className="px-4 py-3 text-center text-sm text-gray-600 ">
        {index + 1}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {productPackage?.name ?? "-"}
      </td>
      <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
        <div className="w-[100px]">{item?.quantity ?? 0}</div>
      </td>
      <td className="px-4 py-3 text-center text-sm text-gray-600">
        <div className="w-[80px]">
          {showMeasurmentName(productPackage?.measurement_code) ?? "-"}
        </div>
      </td>
      {/* <td className="px-4 py-3 text-center text-sm text-gray-600">
        <div className="w-[100px]">{productPackage?.count ?? 0}</div>
      </td> */}
      <td className="px-4 py-3 text-center text-sm text-gray-600">
        {productPackage?.package_name ?? "-"}
      </td>
      <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
        <div className="flex items-center gap-x-1 w-[150px]">
          <FormattedNumber value={item?.price_amount ?? 0} />
          <CurrencyName currency={totals?.[0]?.currency?.name} />
        </div>
      </td>
      {!isDeleted && (
        <>
          <td className="px-4 py-3 text-center text-sm font-medium text-amber-700">
            <div className="w-[100px]">{item?.discount?.amount ?? 0} </div>
          </td>
          <td className="px-4 py-3 text-center text-sm font-medium text-green-700">
            <div className="w-[150px]">
              <FormattedNumber value={item?.net_price?.amount ?? 0} />
              <CurrencyName currency={totals?.[0]?.currency?.name} />
            </div>
          </td>
        </>
      )}
      <td className="px-4 py-3 text-center text-sm font-bold text-blue-700">
        <div className="flex items-center justify-center gap-x-1">
          <FormattedNumber value={item?.totals ?? 0} />
          <CurrencyName currency={totals?.[0]?.currency?.name} />
        </div>
      </td>
      <td>
        <div className="w-[100px] text-center py-3 text-sm text-gray-600">
          {item?.warehouse_operation_from?.warehouse?.name ?? "-"}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;

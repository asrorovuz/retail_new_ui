
export const columns = () => {
  return [
    {
      header: () => (
        <div className="text-sm font-medium text-gray-600">НОМЕНКЛАТУРА</div>
      ),
      accessorKey: "productName",
      meta: {
        bodyCellClassName: "text-start",
        headerClassName: "text-xs font-medium text-gray-800",
      },
    },
    {
      header: () => (
        <div className="text-sm font-medium text-gray-600">ЦЕНА</div>
      ),
      accessorKey: "priceAmount",
      meta: {
        bodyCellClassName: "text-start min-w-full max-w-full",
      },
    },
    {
      header: () => (
        <div className="text-sm font-medium text-gray-600">КОЛ-ВО</div>
      ),
      accessorKey: "quantity",
      meta: {
        bodyCellClassName: "text-start min-w-full max-w-full",
      },
    },
    {
      header: () => (
        <div className="text-sm font-medium text-gray-600">СУММА</div>
      ),
      accessorKey: "totalAmount",
      meta: {
        bodyCellClassName: "text-start min-w-full max-w-full",
      },
      //   cell: ({
      //     row: {
      //       original: { totalAmount },
      //     },
      //   }) => <FormattedNumber value={totalAmount.toFixed(2)} />,
    },
  ];
};

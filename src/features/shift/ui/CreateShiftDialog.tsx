// import { Dialog } from "@/shared/ui/kit"
// import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
// import { useMemo, type Dispatch, type SetStateAction } from "react"
// import { toast } from "react-toastify"

import { Dialog } from "@/shared/ui/kit";

// export const paymentTypes = {
//     [1]: 'img/payments/cash.png',
//     [2]: 'img/payments/uzcard.jpg',
//     [3]: 'img/payments/humo.png',
//     [5]: 'img/payments/click.png',
//     [6]: 'img/payments/payme.png',
//     [7]: 'img/payments/visa.png',
// }

// type CreateShiftDialogProps = {
//     isOpen: boolean
//     onClose: () => void
//     setSelectedCashboxId: Dispatch<SetStateAction<number | null>>
//     setTabValue: Dispatch<SetStateAction<'cashbox' | 'shift'>>
//     selectedCashboxId: number | null
//     tabValue: 'cashbox' | 'shift'
// }

// const CreateShiftDialog = ({
//     isOpen,
//     onClose,
//     setTabValue,
// }: CreateShiftDialogProps) => {

//     const { data: cashboxs } = useSWR<Cashbox[]>(
//         servicePaths.cashbox.getCashbox,
//         getFetcher,
//     )

//     const {
//         data: lastActiveShift,
//         isLoading: fetchLastActiveShiftLoading,
//         mutate,
//     } = useSWR<Shift>(
//         cashboxs?.[0]
//             ? `/api/shift/last-active/get?cash_box_id=${cashboxs?.[0].id}`
//             : null,
//         getFetcher,
//     )

//     useEffect(() => {
//         if (isOpen) {
//             mutate()
//         }
//     }, [isOpen])

//     const { setActiveShift } = useSettingsStore()

//     const { trigger: triggerShiftOpen, isMutating: createShiftLoading } =
//         useSWRMutation<Shift>('/api/shift/open', postFetcher)

//     const shiftColumns: ColumnDef<Balance>[] = useMemo(
//         () => [
//             {
//                 accessorKey: 'type',
//                 header: () => <div className="text-center">Типы платежей</div>,
//                 size: 120,
//                 cell: (info) => {
//                     const item = info.row.original
//                     return (
//                         <div className="flex justify-center">
//                             <img
//                                 src={
//                                     paymentTypes[
//                                         item.type as keyof typeof paymentTypes
//                                     ]
//                                 }
//                                 alt=""
//                                 className="w-10 h-6 object-contain"
//                             />
//                         </div>
//                     )
//                 },
//             },
//             {
//                 accessorKey: 'sum',
//                 header: () => <div className="text-center">Сумма</div>,
//                 size: 140,
//                 cell: (info) => {
//                     const item = info.row.original
//                     return (
//                         <div className="text-center font-semibold text-sm">
//                             {numericFormatter(item.amount.toFixed(2))}{' '}
//                             {CurrencyCodeUZSText}
//                         </div>
//                     )
//                 },
//             },
//         ],
//         [],
//     )

//     const shiftData = useMemo(
//         () => lastActiveShift?.cashboxes_balance_closing.balances ?? [],
//         [lastActiveShift],
//     )

//     const shiftTable = useReactTable<Balance>({
//         data: shiftData,
//         columns: shiftColumns,
//         getCoreRowModel: getCoreRowModel(),
//         defaultColumn: {
//             size: 130,
//         },
//     })

//     const handleShiftCreate = async () => {
//         console.log(cashboxs)
//         if (cashboxs?.length === 0) {
//             toast.warning('Упс, что-то пошло не так. Обратитесь к администратору, чтобы решить эту проблему.')
//             // notify({
//             //     placement: 'bottom-end',
//             //     type: 'danger',
//             //     closable: true,
//             //     title: 'Cashbox not found!',
//             //     message:
//             //         ,
//             //     duration: 5000,
//             // })

//             return
//         }
//         await afterRequest(
//             triggerShiftOpen,
//             {
//                 data: {
//                     cash_box_id: cashboxs?.[0].id,
//                 },
//             },
//             (res: Shift) => {
//                 notify({
//                     placement: 'bottom-end',
//                     type: 'success',
//                     closable: true,
//                     title: 'Смена успешно создана',
//                     duration: 2000,
//                 })
//                 setActiveShift(res)
//                 onClose()
//             },
//             (err: any) => {
//                 if (
//                     err?.shift_disabled ||
//                     err?.response?.data?.shift_disabled
//                 ) {
//                     // notify({
//                     //     placement: 'bottom-end',
//                     //     type: 'danger',
//                     //     closable: true,
//                     //     title: 'Смена недоступна',
//                     //     message:
//                     //         "Чтобы создать смену, включите функцию 'Смена' в настройках.",
//                     //     duration: 2000,
//                     // })
//                     return
//                 }
//                 // notify({
//                 //     placement: 'bottom-end',
//                 //     type: 'danger',
//                 //     closable: true,
//                 //     title: t(`common.error`),
//                 //     duration: 2000,
//                 // })
//                 console.error('shift create', err)
//             },
//         )
//     }

//     return (
//         <Dialog
//             isOpen={isOpen}
//             onClose={() => {
//                 onClose()
//                 setTabValue('cashbox')
//             }}
//             width={480}
//             overlayClassName="dialog-overlay flex items-center justify-center"
//         >
//             <div className="flex flex-col h-full max-h-[70vh]">
//                 <div className="flex-shrink-0 pb-4 border-b">
//                     <h5 className="text-lg font-semibold">Открыть смену</h5>
//                     <p className="text-sm text-gray-500 mt-1">
//                         Остатки с последней смены
//                     </p>
//                 </div>

//                 <div className="flex-1 overflow-hidden mt-4">
//                     {fetchLastActiveShiftLoading && (
//                         <div className="flex items-center justify-center py-16">
//                             {/* <LuLoaderCircle className="size-7 animate-spin text-blue-500" /> */}
//                         </div>
//                     )}

//                     {!fetchLastActiveShiftLoading && !lastActiveShift && (
//                         <div className="flex flex-col items-center justify-center py-16 text-center">
//                             {/* <FileNotFound /> */}
//                             <p className="text-gray-500 mt-2 text-sm">
//                                 До вас смены не было.
//                             </p>
//                         </div>
//                     )}

//                     {!fetchLastActiveShiftLoading && lastActiveShift && (
//                         <div className="h-full overflow-auto">
//                             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                                 <table className="w-full">
//                                     <thead className="bg-blue-50 border-b border-blue-200">
//                                         {shiftTable
//                                             .getHeaderGroups()
//                                             .map((headerGroup) => (
//                                                 <tr key={headerGroup.id}>
//                                                     {headerGroup.headers.map(
//                                                         (header) => (
//                                                             <th
//                                                                 key={header.id}
//                                                                 className="text-blue-700 font-semibold text-xs px-3 py-2"
//                                                             >
//                                                                 {flexRender(
//                                                                     header
//                                                                         .column
//                                                                         .columnDef
//                                                                         .header,
//                                                                     header.getContext(),
//                                                                 )}
//                                                             </th>
//                                                         ),
//                                                     )}
//                                                 </tr>
//                                             ))}
//                                     </thead>
//                                     <tbody>
//                                         {shiftTable
//                                             .getRowModel()
//                                             .rows.map((row) => (
//                                                 <tr
//                                                     key={row.id}
//                                                     className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
//                                                 >
//                                                     {row
//                                                         .getVisibleCells()
//                                                         .map((cell) => (
//                                                             <td
//                                                                 key={cell.id}
//                                                                 className="px-3 py-2 text-center"
//                                                             >
//                                                                 {flexRender(
//                                                                     cell.column
//                                                                         .columnDef
//                                                                         .cell,
//                                                                     cell.getContext(),
//                                                                 )}
//                                                             </td>
//                                                         ))}
//                                                 </tr>
//                                             ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-sm font-medium text-blue-700">
//                                         Общая сумма:
//                                     </span>
//                                     <span className="font-bold text-blue-800">
//                                         {numericFormatter(
//                                             shiftData
//                                                 .reduce(
//                                                     (sum, item) =>
//                                                         sum + item.amount,
//                                                     0,
//                                                 )
//                                                 .toFixed(2),
//                                         )}{' '}
//                                         {CurrencyCodeUZSText}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex-shrink-0 mt-4 pt-4 border-t bg-white">
//                     <div className="flex gap-3">
//                         <Button
//                             variant="plain"
//                             className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
//                             onClick={() => {
//                                 onClose()
//                                 setTabValue('cashbox')
//                             }}
//                             disabled={createShiftLoading}
//                         >
//                             Отменить
//                         </Button>
//                         <Button
//                             variant="plain"
//                             className="flex-1 bg-green-600 hover:bg-green-700 text-white"
//                             onClick={() => handleShiftCreate()}
//                             disabled={createShiftLoading}
//                         >
//                             {createShiftLoading
//                                 ? 'Открытие...'
//                                 : 'Открыть смену'}
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </Dialog>
//     )
// }

// export default CreateShiftDialog

type PropsType = {
  isOpen: boolean;
};

const CreateShiftDialog = ({ isOpen }: PropsType) => {
  return (
    <Dialog width={480} isOpen={isOpen} title={"Открыть смену"}>
      CreateShiftDialog
    </Dialog>
  );
};

export default CreateShiftDialog;

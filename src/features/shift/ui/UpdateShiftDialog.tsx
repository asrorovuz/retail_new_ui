// import Loading from '@/components/shared/Loader/Loading'
// import Button from '@/components/ui/Button'
// import Card from '@/components/ui/Card'
// import Dialog from '@/components/ui/Dialog'
// import { useNotification } from '@/hooks'
// import { afterRequest, getFetcher, postFetcher } from '@/utils/axios'
// import {
//     ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
// } from '@tanstack/react-table'
// import { useTranslation } from 'react-i18next'
// import { FaMoneyBillWave, FaRegCreditCard } from 'react-icons/fa'
// import { HiOutlineNewspaper } from 'react-icons/hi'
// import { TbReceiptDollar } from 'react-icons/tb'
// import useSWR, { mutate } from 'swr'
// import useSWRMutation from 'swr/mutation'
// import { paymentTypes } from './CreateShiftDialog'
// import {
//     useMemo,
//     useCallback,
//     useEffect,
//     Dispatch,
//     SetStateAction,
// } from 'react'
// import { numericFormatter } from '@/helpers/numericFormatter'
// import Input from '@/components/ui/Input'
// import { z } from 'zod'
// import { useFieldArray, useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import FileNotFound from '@/assets/svg/FileNotFound'
// import { IoIosMagnet } from 'react-icons/io'
// import NumericInput from '@/components/shared/NumericInput'
// import { useSettingsStore } from '@/store'

// const shiftUpdateSchema = z.object({
//     balances: z.array(
//         z.object({
//             type: z.number(),
//             amount: z.string().min(1, 'Обязательное поле'),
//             expected: z.number(),
//             difference: z.number(),
//         }),
//     ),
// })

// type ShiftUpdateFormData = z.infer<typeof shiftUpdateSchema>

// type UpdateShiftDialogProps = {
//     isOpen: boolean
//     onClose: () => void
//     activeShift: Shift | null
// }

// const UpdateShiftDialog = ({ isOpen, onClose }: UpdateShiftDialogProps) => {
//     const notify = useNotification()
//     const { t } = useTranslation()

//     const {
//         control,
//         handleSubmit,
//         register,
//         watch,
//         setValue,
//         reset,
//         formState: { errors, isSubmitting },
//     } = useForm<ShiftUpdateFormData>({
//         resolver: zodResolver(shiftUpdateSchema),
//         defaultValues: {
//             balances: [],
//         },
//     })

//     const { fields } = useFieldArray({
//         control,
//         name: 'balances',
//     })

//     const handleClose = useCallback(() => {
//         onClose()
//     }, [onClose])

//     const { activeShift: shift, setActiveShift } = useSettingsStore()

//     const {
//         data: activeShift,
//         isLoading,
//         isValidating,
//         mutate: activeShiftMutate,
//     } = useSWR<Shift>(isOpen ? '/api/shift/active/get' : null, getFetcher)

//     useEffect(() => {
//         if (isValidating && !shift) {
//             setActiveShift(shift)
//         }
//     }, [isValidating, shift])

//     const {
//         data: shiftOperations,
//         isLoading: fetchActiveLoading,
//         mutate,
//     } = useSWR<ShiftOperation>(
//         shift?.id ? `/api/shift/operation/get/${shift.id}` : null,
//         getFetcher,
//     )

//     useEffect(() => {
//         if (isOpen) {
//             mutate()
//             activeShiftMutate()
//         }
//     }, [isOpen])

//     const { trigger: closeShiftTrigger } = useSWRMutation<Shift>(
//         '/api/shift/close',
//         postFetcher,
//     )

//     const tableData = useMemo(() => {
//         return fields
//     }, [fields])

//     useEffect(() => {
//         if (isOpen && activeShift?.cashboxes_expected?.balances) {
//             const initialValues = activeShift.cashboxes_expected.balances.map(
//                 (balance) => ({
//                     type: balance.type,
//                     amount: '',
//                     expected: balance.amount,
//                     difference: balance.amount,
//                 }),
//             )
//             reset({ balances: initialValues })
//         }
//     }, [isOpen, activeShift, reset])

//     const watchedBalances = watch('balances')

//     useEffect(() => {
//         if (watchedBalances) {
//             watchedBalances.forEach((balance, index) => {
//                 const actual = parseFloat(balance.amount) || 0
//                 const difference = balance.expected - actual
//                 setValue(`balances.${index}.difference`, difference)
//             })
//         }
//     }, [watchedBalances, setValue])

//     const handleShiftUpdate = async (data: ShiftUpdateFormData) => {
//         try {
//             const cashboxes_balance_closing = data.balances.map((balance) => ({
//                 type: balance.type,
//                 amount: parseFloat(balance.amount),
//                 currency_code: 860,
//             }))

//             await afterRequest(
//                 closeShiftTrigger,
//                 {
//                     data: { cashboxes_balance_closing },
//                 },
//                 (res) => {
//                     notify({
//                         placement: 'bottom-end',
//                         type: 'success',
//                         closable: true,
//                         title: 'Смена успешно закрыта',
//                         duration: 2000,
//                     })
//                     handleClose()
//                     setActiveShift(null)
//                 },
//                 (err) => {
//                     notify({
//                         placement: 'bottom-end',
//                         type: 'danger',
//                         closable: true,
//                         title: t(`common.error`),
//                         duration: 2000,
//                     })
//                 },
//             )
//         } catch (err) {
//             console.error('Error closing shift:', err)
//         }
//     }

//     const columns: ColumnDef<(typeof fields)[0]>[] = useMemo(
//         () => [
//             {
//                 header: 'Типы платежей',
//                 size: 100,
//                 cell: (info) => {
//                     const item = info.row.original
//                     const paymentType =
//                         paymentTypes[item.type as keyof typeof paymentTypes]
//                     return (
//                         <div className="flex justify-center">
//                             <img
//                                 src={paymentType}
//                                 alt={String(item.type)}
//                                 className="w-10 h-6 object-contain"
//                             />
//                         </div>
//                     )
//                 },
//                 footer: () => (
//                     <div className="text-center font-semibold">Итог</div>
//                 ),
//             },
//             {
//                 header: 'Начало',
//                 size: 90,
//                 cell: (info) => {
//                     const item = info.row.original
//                     const openingBalance =
//                         activeShift?.cashboxes_balance_opening?.balances?.find(
//                             (b) => b.type === item.type,
//                         )
//                     return (
//                         <div className="text-sm">
//                             {numericFormatter(
//                                 openingBalance?.amount.toFixed(2) ?? 0,
//                             )}
//                         </div>
//                     )
//                 },
//                 footer: () => {
//                     const total =
//                         shiftOperations?.shift_contract
//                             .cashboxes_balance_opening?.total?.[0]?.amount ?? 0
//                     return (
//                         <div className="text-sm font-semibold">
//                             {numericFormatter(total.toFixed(2))}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Приход',
//                 size: 90,
//                 cell: (info) => {
//                     const item = info.row.original
//                     const incoming =
//                         activeShift?.cashboxes_in_balance?.balances?.find(
//                             (b) => b.type === item.type,
//                         )
//                     return (
//                         <div className="text-sm text-green-600">
//                             {numericFormatter(incoming?.amount.toFixed(2) ?? 0)}
//                         </div>
//                     )
//                 },
//                 footer: () => {
//                     const total =
//                         shiftOperations?.shift_contract.cashboxes_in_balance
//                             ?.total?.[0].amount ?? 0
//                     return (
//                         <div className="text-sm font-semibold text-green-600">
//                             {numericFormatter(total.toFixed(2))}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Расход',
//                 size: 90,
//                 cell: (info) => {
//                     const item = info.row.original
//                     const outgoing =
//                         activeShift?.cashboxes_out_balance?.balances?.find(
//                             (b) => b.type === item.type,
//                         )
//                     return (
//                         <div className="text-sm text-red-600">
//                             {numericFormatter(outgoing?.amount.toFixed(2) ?? 0)}
//                         </div>
//                     )
//                 },
//                 footer: () => {
//                     const total =
//                         shiftOperations?.shift_contract.cashboxes_out_balance
//                             ?.total?.[0].amount ?? 0
//                     return (
//                         <div className="text-sm font-semibold text-red-600">
//                             {numericFormatter(total.toFixed(2))}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Ожидается',
//                 size: 100,
//                 cell: (info) => {
//                     const item = info.row.original
//                     return (
//                         <div className="text-sm font-medium">
//                             {numericFormatter(item?.expected.toFixed(2))}
//                         </div>
//                     )
//                 },
//                 footer: () => {
//                     const total =
//                         shiftOperations?.shift_contract.cashboxes_expected
//                             ?.total?.[0].amount ?? 0
//                     return (
//                         <div className="text-sm font-semibold">
//                             {numericFormatter(total.toFixed(2))}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Фактически',
//                 size: 140,
//                 cell: (info) => {
//                     const index = info.row.index
//                     const item = info.row.original
//                     return (
//                         <div className="space-y-1">
//                             <div className="flex items-center gap-1">
//                                 <NumericInput
//                                     placeholder="Сумма"
//                                     size="sm"
//                                     className="text-xs"
//                                     type="text"
//                                     value={
//                                         watch(`balances.${index}.amount`) !==
//                                             null &&
//                                         watch(`balances.${index}.amount`) !==
//                                             undefined
//                                             ? numericFormatter(
//                                                   Number(
//                                                       watch(
//                                                           `balances.${index}.amount`,
//                                                       ),
//                                                   ),
//                                               )
//                                             : ''
//                                     }
//                                     onChange={(e) => {
//                                         const val = e.target.value.replace(
//                                             /\s/g,
//                                             '',
//                                         )
//                                         setValue(
//                                             `balances.${index}.amount`,
//                                             val === '' ? '' : val,
//                                         )
//                                     }}
//                                 />
//                                 <IoIosMagnet
//                                     onClick={() => {
//                                         setValue(
//                                             `balances.${index}.amount`,
//                                             String(item?.expected),
//                                         )
//                                     }}
//                                     className="size-6 text-blue-500 cursor-pointer hover:text-blue-600 flex-shrink-0"
//                                 />
//                             </div>
//                             {errors.balances?.[index]?.amount && (
//                                 <p className="text-red-500 text-xs">
//                                     {errors.balances[index]?.amount?.message}
//                                 </p>
//                             )}
//                         </div>
//                     )
//                 },
//                 footer: () => {
//                     const factosSum = watchedBalances.reduce(
//                         (acc, cur) => Number(acc) + Number(cur.amount),
//                         0,
//                     )
//                     return (
//                         <div className="text-sm font-semibold">
//                             {numericFormatter(factosSum.toFixed(2) ?? 0)}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Разница',
//                 size: 90,
//                 cell: (info) => {
//                     const index = info.row.index
//                     const difference = watchedBalances?.[index]?.difference || 0
//                     const actual = parseFloat(
//                         watchedBalances?.[index]?.amount || '0',
//                     )
//                     const expected = watchedBalances?.[index]?.expected || 0
//                     const factosValue = watch(`balances.${index}.amount`)
//                     const isOverpayment = actual > expected
//                     const isUnderpayment = actual < expected

//                     return (
//                         <div
//                             className={`text-sm font-medium ${
//                                 isUnderpayment
//                                     ? 'text-red-600'
//                                     : isOverpayment
//                                       ? 'text-green-600'
//                                       : 'text-gray-600'
//                             }`}
//                         >
//                             {numericFormatter(
//                                 (difference - Number(factosValue)).toFixed(2),
//                             )}
//                         </div>
//                     )
//                 },
//                 footer: () => {
//                     const totalDifference =
//                         watchedBalances?.reduce((acc, balance) => {
//                             const actual = parseFloat(balance.amount || '0')
//                             return acc + (balance.expected - actual)
//                         }, 0) ?? 0

//                     return (
//                         <div className="text-sm font-bold">
//                             {numericFormatter(totalDifference.toFixed(2))}
//                         </div>
//                     )
//                 },
//             },
//         ],
//         [register, errors, watchedBalances, activeShift, shiftOperations],
//     )

//     const table = useReactTable({
//         data: tableData,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//     })

//     const renderContent = () => {
//         if (isLoading || fetchActiveLoading) {
//             return (
//                 <div className="py-24">
//                     <Loading loading={true} />
//                 </div>
//             )
//         }

//         if (!activeShift) {
//             return (
//                 <div className="py-24 text-center text-gray-500">
//                     Нет активной смены
//                 </div>
//             )
//         }

//         return (
//             <div className="space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="grid grid-cols-4 gap-4">
//                         <div className="text-center">
//                             <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-white border">
//                                 <TbReceiptDollar
//                                     size={14}
//                                     className="text-gray-500"
//                                 />
//                             </div>
//                             <div className="text-xs text-gray-500 uppercase font-medium">
//                                 Чеки
//                             </div>
//                             <div className="text-lg font-bold">
//                                 {shiftOperations?.sale_count ?? 0}
//                             </div>
//                         </div>

//                         <div className="text-center">
//                             <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-white border">
//                                 <FaMoneyBillWave
//                                     size={14}
//                                     className="text-gray-500"
//                                 />
//                             </div>
//                             <div className="text-xs text-gray-500 uppercase font-medium">
//                                 Продажа
//                             </div>
//                             <div className="text-lg font-bold">
//                                 {numericFormatter(
//                                     shiftOperations?.sale_price?.[0]?.amount.toFixed(
//                                         2,
//                                     ) ?? 0,
//                                 )}
//                             </div>
//                         </div>

//                         <div className="text-center">
//                             <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-white border">
//                                 <FaRegCreditCard
//                                     size={14}
//                                     className="text-gray-500"
//                                 />
//                             </div>
//                             <div className="text-xs text-gray-500 uppercase font-medium">
//                                 В долг
//                             </div>
//                             <div className="text-lg font-bold">
//                                 {numericFormatter(
//                                     shiftOperations?.sale_debts?.[0]?.amount.toFixed(
//                                         2,
//                                     ) ?? 0,
//                                 )}
//                             </div>
//                         </div>

//                         <div className="text-center">
//                             <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-white border">
//                                 <HiOutlineNewspaper
//                                     size={14}
//                                     className="text-gray-500"
//                                 />
//                             </div>
//                             <div className="text-xs text-gray-500 uppercase font-medium">
//                                 Средний чек
//                             </div>
//                             <div className="text-lg font-bold">
//                                 {numericFormatter(
//                                     shiftOperations?.average_check?.amount?.toFixed(
//                                         2,
//                                     ) ?? 0,
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
//                         <div className="text-xs text-green-600 font-medium uppercase">
//                             Приход
//                         </div>
//                         <div className="text-xl font-bold text-green-700">
//                             {numericFormatter(
//                                 shiftOperations?.shift_contract.cashboxes_in_balance.total?.[0]?.amount.toFixed(
//                                     2,
//                                 ) ?? 0,
//                             )}
//                         </div>
//                     </div>
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
//                         <div className="text-xs text-red-600 font-medium uppercase">
//                             Расход
//                         </div>
//                         <div className="text-xl font-bold text-red-700">
//                             {numericFormatter(
//                                 shiftOperations?.shift_contract?.cashboxes_out_balance?.total?.[0]?.amount.toFixed(
//                                     2,
//                                 ) ?? 0,
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <Card className="overflow-hidden" bodyClass="p-0">
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50">
//                                 {table.getHeaderGroups().map((headerGroup) => (
//                                     <tr key={headerGroup.id}>
//                                         {headerGroup.headers.map((header) => (
//                                             <th
//                                                 key={header.id}
//                                                 className="text-center text-gray-600 text-xs font-semibold py-2 px-2 border-b"
//                                                 style={{
//                                                     width: header.getSize(),
//                                                 }}
//                                             >
//                                                 {header.isPlaceholder
//                                                     ? null
//                                                     : flexRender(
//                                                           header.column
//                                                               .columnDef.header,
//                                                           header.getContext(),
//                                                       )}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 ))}
//                             </thead>
//                             <tbody>
//                                 {!activeShift ? (
//                                     <tr>
//                                         <td
//                                             colSpan={columns.length}
//                                             className="py-12 text-center"
//                                         >
//                                             <FileNotFound />
//                                             <p className="text-gray-500 mt-2">
//                                                 Операций не было.
//                                             </p>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     table.getRowModel().rows.map((row) => (
//                                         <tr
//                                             key={row.id}
//                                             className="hover:bg-gray-50"
//                                         >
//                                             {row
//                                                 .getVisibleCells()
//                                                 .map((cell) => (
//                                                     <td
//                                                         key={cell.id}
//                                                         className="py-2 px-2 text-center border-b border-gray-100"
//                                                     >
//                                                         {flexRender(
//                                                             cell.column
//                                                                 .columnDef.cell,
//                                                             cell.getContext(),
//                                                         )}
//                                                     </td>
//                                                 ))}
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                             <tfoot className="bg-gray-100">
//                                 {table.getFooterGroups().map((footerGroup) => (
//                                     <tr key={footerGroup.id}>
//                                         {footerGroup.headers.map((header) => (
//                                             <th
//                                                 key={header.id}
//                                                 className="text-center text-gray-700 text-xs font-bold py-2 px-2 border-t"
//                                             >
//                                                 {header.isPlaceholder
//                                                     ? null
//                                                     : flexRender(
//                                                           header.column
//                                                               .columnDef.footer,
//                                                           header.getContext(),
//                                                       )}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 ))}
//                             </tfoot>
//                         </table>
//                     </div>
//                 </Card>
//             </div>
//         )
//     }

//     return (
//         <Dialog isOpen={isOpen} onClose={handleClose} width={1000}>
//             <div className="flex flex-col h-full max-h-[85vh] overflow-auto">
//                 <div className="flex-shrink-0 mb-4">
//                     <h5 className="text-lg font-semibold">Закрыть смену</h5>
//                 </div>

//                 <form
//                     onSubmit={handleSubmit(handleShiftUpdate)}
//                     className="flex flex-col h-full"
//                 >
//                     <div className="flex-1 overflow-y-auto">
//                         {renderContent()}
//                     </div>

//                     <div className="flex-shrink-0 mt-4 pt-4 border-t bg-white">
//                         <div className="flex gap-3">
//                             <Button
//                                 type="button"
//                                 variant="plain"
//                                 className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
//                                 onClick={handleClose}
//                             >
//                                 Отменить
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 variant="plain"
//                                 className="flex-1 bg-green-600 hover:bg-green-700 text-white"
//                             >
//                                 {isSubmitting ? 'Закрытие...' : 'Закрыть смену'}
//                             </Button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </Dialog>
//     )
// }

// export default UpdateShiftDialog

const UpdateShiftDialog = () => {
  return (
    <div>UpdateShiftDialog</div>
  )
}

export default UpdateShiftDialog
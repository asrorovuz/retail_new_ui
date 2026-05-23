import { useOperationItemGetApi } from "@/entities/refund/repository";
import classNames from "@/shared/lib/classNames";
import { Button, Dialog, Input, Table } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

const OperationItemModal = ({ isOpen, onConfirm, onCancel }: any) => {
    const today = new Date().toISOString().split("T")[0];

    const [startDate, setStartDate] = useState<string>(today);
    const [endDate, setEndDate] = useState<string>(today);
    const [selectedId, setSelectedId] = useState<any>(null);

    const { data, isPending } = useOperationItemGetApi({
        type: 1,
        skip: 0,
        limit: 50,
        start_date: startDate,
        end_date: endDate,
    });

    const columns = useMemo(
        () => [
            {
                id: "index",
                header: "№",
                size: 50,
                cell: ({ row }: any) => (
                    <span className="text-slate-500">{row.index + 1}</span>
                ),
            },
            {
                id: "id",
                header: "ID",
                size: 80,
                cell: ({ row }: any) => (
                    <span className="font-medium">
                        {row.original?.id ?? "—"}
                    </span>
                ),
            },
            {
                id: "created_at",
                header: "Дата создания",
                size: 160,
                cell: ({ row }: any) => {
                    const date = row.original?.date;
                    return (
                        <span>
                            {date
                                ? new Date(date).toLocaleString("ru-RU")
                                : "—"}
                        </span>
                    );
                },
            },
            {
                id: "action",
                header: "",
                size: 100,
                cell: ({ row }: any) => (
                    <Button
                        size="sm"
                        variant={
                            selectedId === row.original?.id
                                ? "solid"
                                : "plain"
                        }
                        className={classNames(
                            "w-full h-7 text-xs",
                            selectedId === row.original?.sale?.id
                                ? "!bg-green-500 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                        )}
                        onClick={() => setSelectedId(row.original?.sale?.id)}
                    >
                        {selectedId === row.original?.sale?.id
                            ? "✓ Выбран"
                            : "Выбрать"}
                    </Button>
                ),
            },
        ],
        [selectedId],
    );

    const handleConfirm = () => {
        if (!selectedId) return;
        onConfirm(selectedId);
        setSelectedId(null);
    };

    const handleCancel = () => {
        setSelectedId(null);
        onCancel();
    };

    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Dialog
            isOpen={isOpen}
            closable={false}
            width="680px"
            title="Выбор операции"
        >
            <div className="flex flex-col gap-3">
                {/* ✅ Filterlar */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-xs text-slate-500">Начало</label>
                        <Input
                            size="sm"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-xs text-slate-500">Конец</label>
                        <Input
                            size="sm"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* ✅ Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-y-auto max-h-[380px]">
                        <Table
                            compact
                            overflow={false}
                            className="table-fixed w-full"
                        >
                            <THead className="sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map(
                                            (header, i) => (
                                                <Th
                                                    key={header.id}
                                                    style={{
                                                        width: header.column.getSize(),
                                                    }}
                                                    className={classNames(
                                                        "border text-xs",
                                                        i
                                                            ? "text-right"
                                                            : "text-left",
                                                    )}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                </Th>
                                            ),
                                        )}
                                    </Tr>
                                ))}
                            </THead>

                            <TBody>
                                {isPending ? (
                                    <Tr>
                                        <Td
                                            colSpan={columns.length}
                                            className="!py-16 text-center text-slate-400 text-sm"
                                        >
                                            Загрузка...
                                        </Td>
                                    </Tr>
                                ) : table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row: any) => (
                                        <Tr
                                            key={row.id}
                                            onClick={() =>
                                                setSelectedId(row.original.id)
                                            }
                                            className={classNames(
                                                "cursor-pointer transition-colors",
                                                selectedId === row.original.id
                                                    ? "bg-green-100"
                                                    : "hover:bg-slate-50",
                                            )}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell: any, i: number) => (
                                                    <Td
                                                        key={cell.id}
                                                        style={{
                                                            width: cell.column.getSize(),
                                                        }}
                                                        className={classNames(
                                                            "p-2 text-xs",
                                                            i
                                                                ? "text-right"
                                                                : "text-left",
                                                        )}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </Td>
                                                ))}
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td
                                            colSpan={columns.length}
                                            className="!py-16"
                                        >
                                            <Empty
                                                size={50}
                                                textSize="text-sm"
                                            />
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                    </div>
                </div>

                {/* ✅ Action tugmalar */}
                <div className="flex justify-end gap-2 pt-1">
                    <Button
                        size="sm"
                        variant="plain"
                        onClick={handleCancel}
                        className="px-5"
                    >
                        Отмена
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        disabled={!selectedId}
                        onClick={handleConfirm}
                        className="px-5"
                    >
                        Подтвердить
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default OperationItemModal;

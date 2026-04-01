import {
    useAllProductIKPUApi,
    useUpdateProductCatalogCode,
} from "@/entities/products/repository";
import classNames from "@/shared/lib/classNames";
import { Button, Checkbox, Dialog, Pagination, Table } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { flushSync } from "react-dom";

interface StatusState {
    faild: number;
    success: number;
    total: number;
}

const INITIAL_STATUS: StatusState = {
    faild: 0,
    success: 0,
    total: 0,
};

const UpdateCatalogCode = ({ isOpen, setIsOpen }: any) => {
    const [status, setStatus] = useState<StatusState>(INITIAL_STATUS);
    const [isOpenStatus, setIsOpenStatus] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const cancelRef = useRef(false);

    const { data, isPending } = useAllProductIKPUApi(isOpen);
    const { mutateAsync: updateProductCatalogCode } =
        useUpdateProductCatalogCode();

    const finished =
        status?.total > 0 && status?.success + status?.faild === status?.total;
    const pct = status?.total > 0 ? (status?.success + status?.faild) / status?.total * 100 : 0;

    const columnHelper = createColumnHelper<any>();

    const paginatedData = useMemo(() => {
        const start = (pagination.pageIndex - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;

        return (data as any[])?.slice(start, end) || [];
    }, [data, pagination]);

    const isChecked = (id: number) => selectedIds.includes(id);

    const toggleItem = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(data?.map((item: any) => item.id) || []);
        } else {
            setSelectedIds([]);
        }
    };

    const handleUpdate = async () => {
        setIsOpenStatus(true);
        setStatus(INITIAL_STATUS);
        cancelRef.current = false;

        const total = selectedIds.length;

        setStatus((prev) => ({
            ...prev,
            total,
        }));

        for (const id of selectedIds) {
            try {
                await updateProductCatalogCode({ id });

                flushSync(() => {
                    setStatus((prev) => ({
                        ...prev,
                        success: prev.success + 1,
                    }));
                });
            } catch {
                flushSync(() => {
                    setStatus((prev) => ({
                        ...prev,
                        faild: prev.faild + 1,
                    }));
                });
            }
        }
    };
    const handleCloseBar = () => {
        setStatus(INITIAL_STATUS);
        setIsOpenStatus(false);
    };

    const handleClose = () => {
        setSelectedIds([]);
        setStatus(INITIAL_STATUS);
        setIsOpen(false);
    };

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "index",
                header: () => (
                    <Checkbox
                        checked={
                            selectedIds.length > 0 &&
                            data?.length === selectedIds.length
                        }
                        onChange={(check: any) => toggleSelectAll(check)}
                    />
                ),
                cell: (info) => (
                    <Checkbox
                        checked={isChecked(info.row.original.id)}
                        onChange={() => toggleItem(info.row.original.id)}
                    />
                ),
            }),
            columnHelper.accessor("name", {
                header: "НАЗВАНИЕ",
                cell: (info) => <p>{info.getValue() || "-"}</p>,
            }),
        ],
        [selectedIds, data], // 🔥 SHU MUHIM
    );

    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Dialog
            title={"Обновить код ИКПУ"}
            onClose={handleClose}
            isOpen={isOpen}
        >
            <div className="mb-3 border h-[60vh] border-slate-300 rounded-3xl overflow-auto">
                {data && data?.length > 0 && !isPending ? (
                    <Table className="min-w-full table-fixed border-separate border-spacing-0">
                        <THead className="sticky top-0">
                            {table.getHeaderGroups().map((headerGroup) => {
                                return (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const isActionsColumn =
                                                header.column.id === "actions";
                                            return (
                                                <Th
                                                    className={
                                                        isActionsColumn
                                                            ? " bg-white"
                                                            : ""
                                                    }
                                                    key={header.id}
                                                >
                                                    <div
                                                        className={classNames(
                                                            "px-4 text-left font-medium text-xs xl:text-sm text-slate-800",
                                                            header.column
                                                                .columnDef.meta
                                                                ?.headerClassName,
                                                        )}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                    </div>
                                                </Th>
                                            );
                                        })}
                                    </Tr>
                                );
                            })}
                        </THead>
                        <TBody>
                            {table.getRowModel().rows.map((row, index) => (
                                <Tr
                                    key={row.id}
                                    className={`${index % 2 ? "bg-white" : "bg-slate-100"} hover:bg-slate-100 transition`}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td
                                                key={cell.id}
                                                className={classNames(
                                                    cell.column.columnDef.meta
                                                        ?.bodyCellClassName,
                                                )}
                                            >
                                                <div
                                                    className={classNames(
                                                        "py-3 text-xs xl:text-sm px-4",
                                                    )}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </div>
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : (
                    <div>
                        <Empty />
                    </div>
                )}
            </div>

            {/* 🔹 Pagination */}
            <Pagination
                total={data?.length || 0}
                pageSize={pagination.pageSize}
                currentPage={pagination.pageIndex}
                onChange={(page, size) =>
                    setPagination({
                        pageIndex: page,
                        pageSize: size || pagination.pageSize,
                    })
                }
            />

            <div className="flex justify-end mt-4">
                <Button
                    disabled={selectedIds.length === 0}
                    variant="solid"
                    onClick={() => {
                        setIsOpenStatus(true);
                        handleUpdate();
                    }}
                >
                    Обновить ({selectedIds.length})
                </Button>
            </div>

            <Dialog
                width={"60vw"}
                closable={false}
                onClose={() => setIsOpenStatus(false)}
                isOpen={isOpenStatus}
            >
                {isPending ? (
                    <div>Загрузка...</div>
                ) : (
                    <>
                        {finished ? (
                            <h2 className="flex items-center justify-center gap-x-2 mt-10 mb-10">
                                <span className="text-green-500">
                                    <FaCheckCircle />
                                </span>{" "}
                                Завершено
                            </h2>
                        ) : (
                            ""
                        )}
                        <div className="mb-10">
                            <div
                                className="w-full mb-2 rounded-lg bg-slate-200 shadow-inner overflow-hidden"
                                role="progressbar"
                                aria-valuenow={pct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className={classNames(
                                        "flex items-center justify-center text-white font-semibold text-xs sm:text-sm select-none",
                                        "h-6 transition-[width] duration-500 ease-in-out",
                                        // 🔹 oddiy gradient + background-size
                                        "bg-[linear-gradient(45deg,#3b82f6_25%,#2563eb_25%,#2563eb_50%,#3b82f6_50%,#3b82f6_75%,#2563eb_75%,#2563eb_100%)]",
                                        "bg-[length:40px_40px]",
                                        // 🔹 harakatli animatsiya
                                        "animate-stripes",
                                    )}
                                    style={{ width: `${pct}%` }}
                                ></div>
                            </div>
                            {data?.length && (
                                <div className="text-center text-blue-500 font-semibold">
                                    {pct.toFixed(2)} %
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-around gap-x-5 mb-10">
                            <div className="flex flex-col items-center text-green-600 font-semibold text-[16px]">
                                <p className="text-[20px]">{status?.success}</p>
                                <p>(Успешно загруженных)</p>
                            </div>
                            <div className="text-[28px] text-gray-700">
                                {status?.success + status?.faild} из{" "}
                                {selectedIds?.length}
                            </div>
                            <div className="flex flex-col items-center text-red-600 font-semibold text-[16px]">
                                <p className="text-[20px]">{status?.faild}</p>
                                <p>(Неудавшихся загрузить)</p>
                            </div>
                        </div>
                        <div className="flex justify-center mb-10 gap-x-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                    cancelRef.current = true;
                                    setIsOpenStatus(false);
                                }}
                            >
                                Отменить
                            </Button>
                            <Button
                                disabled={!finished && !cancelRef.current}
                                onClick={handleCloseBar}
                                variant="solid"
                                size="sm"
                            >
                                Нажмите, чтобы продолжить
                            </Button>
                        </div>
                    </>
                )}
            </Dialog>
        </Dialog>
    );
};

export default UpdateCatalogCode;

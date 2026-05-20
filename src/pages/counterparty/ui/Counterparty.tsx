import { messages } from "@/app/constants/message.request";
import { useDeleteContractor } from "@/entities/auth/repository";
import { useAllProductApi } from "@/entities/products/repository";
import {
    useContractorByIdApi,
    useContractorProductApi,
    useDeleteProductContractorApi,
} from "@/entities/purchase/repository";
import { useContractorApi } from "@/entities/sale/repository";
import ContragentModal from "@/features/modals/ui/ContragentModal";
import PaymentDebtsModal from "@/features/modals/ui/PaymentDebtsModal";
import SearchProduct from "@/features/search-product";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import {
    Button,
    Dialog,
    Dropdown,
    Pagination,
    Select,
    Table,
} from "@/shared/ui/kit";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import DropdownItem from "@/shared/ui/kit/Dropdown/DropdownItem";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";

export type ContragentType = {
    id: number;
    name: string;
    is_customer: boolean;
    is_supplier: boolean;
    is_default: boolean;
    debts: {
        amount: number;
        currency_code: number;
    }[];
    contacts?: {
        value: string;
    }[];
};

const Counterparty = () => {
    const [search, setSearch] = useState("");
    const [searchFocus, setSearchFocus] = useState(false);
    const [searchContractor, setSearchContractor] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenProducts, setIsOpenProduct] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 20,
    });
    const [type, setType] = useState<"add" | "edit">("add");
    const [deleteModal, setDeleteModal] = useState(false);
    const [dobtModal, setDebitModal] = useState(false);
    const [contractorId, setContractorId] = useState<number | null>(null);
    const [contragent, setContragent] = useState<ContragentType | null>(null);
    const [products, setProducts] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        is_customer: false,
        is_supplier: false,
    });
    // const [errors, setErrors] = useState<any>(null);
    const isFilter = filter.is_customer
        ? { is_customer: true }
        : filter.is_supplier
          ? { is_supplier: true }
          : undefined;

    // Ref for detecting outside click on search dropdown
    const dropdownRef = useRef<HTMLDivElement>(null);

    const columnHelper = createColumnHelper<any>();

    const { data, isPending } = useContractorApi(true, search, isFilter);
    const { mutate: deleteMutate, isPending: isDeletePending } =
        useDeleteContractor();
    const { data: productsData, isPending: productsPending } = useAllProductApi(
        20,
        1,
        searchContractor,
    );
    const { data: contractorProductData } = useContractorByIdApi(contractorId);
    const { mutateAsync: contractorProductCreateAsync } =
        useContractorProductApi();
    const { mutate: deleteProductMutate } = useDeleteProductContractorApi();
    // const [filterItems, setFilterItems] = useState({
    //   type: null,
    //   debit: null,
    // });

    useEffect(() => {
        if (isOpenProducts) {
            const newProducts = contractorProductData?.map((elem: any) => {
                return {
                    id: elem?.id,
                    product: {
                        id: elem?.product?.id,
                        name: elem?.product?.name,
                    },
                };
            });

            setProducts(newProducts);
        }
    }, [isOpenProducts, contractorProductData]);

    useEffect(() => {
        if (searchContractor.trim().length > 0) {
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    }, [searchContractor]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onDeleteContragent = () => {
        if (contragent) {
            deleteMutate(contragent?.id, {
                onSuccess() {
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );
                    setContragent(null);
                    setDeleteModal(false);
                },
                onError(err) {
                    showErrorMessage(err);
                },
            });
        }
    };

    const onDeleteContractorProduct = (product: any) => {
        if (product?.id) {
            deleteProductMutate(product?.id, {
                onSuccess() {
                    setProducts((prev: any) =>
                        prev.filter(
                            (p: any) => p.product?.id !== product?.product?.id,
                        ),
                    );
                },
                onError(err) {
                    showErrorMessage(err);
                },
            });
        } else {
            setProducts((prev: any) =>
                prev.filter((p: any) => p.product?.id !== product?.product?.id),
            );
        }
    };

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "index",
                header: "№",
                cell: (info) =>
                    (pagination?.pageIndex - 1) * pagination?.pageSize +
                    (info?.row?.index + 1),
                size: 60,
            }),
            columnHelper.display({
                id: "name",
                header: "НАЗВАНИЕ",
                cell: ({ row }) => (
                    <p className="w-[250px]">{row.original.name || "-"}</p>
                ),
            }),
            columnHelper.display({
                id: "type",
                header: "Тип",
                cell: ({ row }) => {
                    const types: string[] = [];
                    if (row.original.is_customer) types.push("Клиент");
                    if (row.original.is_supplier) types.push("Поставщик");

                    if (!types.length)
                        return <p className="w-[180px]">-</p>;

                    return (
                        <div className="flex flex-col gap-1 w-[180px]">
                            {types.map((t) => (
                                <span
                                    key={t}
                                    className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${
                                        t === "Клиент"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-orange-100 text-orange-700"
                                    }`}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    );
                },
            }),
            columnHelper.display({
                id: "price",
                header: "Задолжность",
                cell: ({ row }) => {
                    const totalPrice =
                        row.original?.debts?.reduce(
                            (acc: number, item: { amount: number }) =>
                                acc + item.amount,
                            0,
                        ) ?? 0;
                    return (
                        <p className="w-[200px]">
                            <FormattedNumber value={totalPrice} scale={2} />
                        </p>
                    );
                },
            }),
            columnHelper.display({
                id: "date",
                header: "Дата операцы",
                cell: ({ row }) => (
                    <p className="w-[120px]">
                        {dayjs(row.original.created_at).format(
                            "YYYY-MM-DD HH:mm",
                        ) || "-"}
                    </p>
                ),
            }),
            columnHelper.display({
                id: "phone",
                header: "Тел. номер",
                cell: ({ row }) => {
                    const contacts = row.original?.contacts || [];

                    if (contacts.length === 0) return <span>-</span>;

                    return (
                        <div className="flex flex-col gap-1">
                            {contacts.map((item: any, index: number) => {
                                const value = item?.value || "";

                                // +998 XX XXX XX XX format
                                const formatted =
                                    value.length === 12
                                        ? `+${value.slice(0, 3)} ${value.slice(3, 5)} ${value.slice(5, 8)} ${value.slice(8, 10)} ${value.slice(10)}`
                                        : value;

                                return (
                                    <span key={index} className="w-[180px]">
                                        {formatted || "-"}
                                    </span>
                                );
                            })}
                        </div>
                    );
                },
            }),
            // columnHelper.display({
            //   id: "comment",
            //   header: "Коментарие",
            //   cell: ({ row }) => (
            //     <p className="w-[280px]">{row.original.name || "-"}</p>
            //   ),
            // }),
            columnHelper.display({
                id: "action",
                header: "",
                cell: ({ row }) => (
                    <Dropdown renderTitle={<HiDotsHorizontal size={22} />}>
                        <DropdownItem
                            onClick={() => {
                                setDebitModal(true);
                                setContractorId(row.original?.id);
                            }}
                        >
                            <div className="w-full flex items-center gap-2 text-slate-700 rounded-xl">
                                💰 Погасить долг
                            </div>
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                setType("edit");
                                setContragent(row.original);
                                setIsOpen(true);
                            }}
                        >
                            <div className="w-full flex items-center gap-2 text-slate-700 rounded-xl">
                                <FaRegEdit />
                                Редактировать
                            </div>
                        </DropdownItem>
                        {row?.original?.is_supplier && (
                            <>
                                <DropdownItem
                                    onClick={() => {
                                        setDebitModal(true);
                                        setContractorId(row.original?.id);
                                    }}
                                >
                                    <div className="w-full flex items-center gap-2 text-slate-700 rounded-xl">
                                        💰 Оплата поставщику
                                    </div>
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() =>
                                        openProductModal(row?.original?.id)
                                    }
                                >
                                    <div className="w-full flex items-center gap-2 text-slate-700 rounded-xl">
                                        <MdOutlinePostAdd />
                                        Товары поставщика
                                    </div>
                                </DropdownItem>
                            </>
                        )}

                        <DropdownItem
                            onClick={() => {
                                setDeleteModal(true);
                                setContragent(row.original);
                            }}
                        >
                            <div className="w-full flex items-center gap-2 text-red-500 rounded-xl">
                                <IoTrashOutline />
                                Удалить
                            </div>
                        </DropdownItem>
                    </Dropdown>
                ),
            }),
        ],
        [pagination, search],
    );

    const onSelect = (id: number) => {
        const selected = productsData?.find((el: any) => el?.id === id);
        if (!selected) return;

        setProducts((prev: any) => {
            const safeList = Array.isArray(prev) ? prev : [];
            const alreadyAdded = safeList.some((p: any) => p?.id === id);
            if (alreadyAdded) return safeList;
            return [
                ...safeList,
                { id: null, product: { id: selected.id, name: selected.name } },
            ];
        });

        setSearchContractor("");
        setIsDropdownOpen(false);
    };

    const onSave = async () => {
        if (!contractorId) return;

        try {
            setLoading(true);
            const filterData = products?.filter((item: any) => !item?.id);

            await Promise.allSettled(
                filterData.map(async (item: any) => {
                    const payload = {
                        contractor_id: contractorId,
                        product_id: item?.product?.id,
                    };

                    try {
                        await contractorProductCreateAsync(payload);
                    } catch (err) {
                        console.log(err);

                        // setErrors((prev: any) => [...prev, item?.name]);
                    }
                }),
            );
            showSuccessMessage(
                messages.uz.SUCCESS_MESSAGE,
                messages.ru.SUCCESS_MESSAGE,
            );
            setIsOpenProduct(false);
        } catch (err) {
            showErrorMessage(err);
        } finally {
            setLoading(false);
        }
    };

    const openProductModal = (id: number) => {
        setIsOpenProduct(true);
        setContractorId(id);
    };

    const closeContractorProductModal = () => {
        setSearchContractor("");
        setIsDropdownOpen(false);
        setIsOpenProduct(false);
        setProducts(null);
    };

    const table = useReactTable({
        data: (data as unknown as any) || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-white h-screen p-2 flex flex-col">
            <div className="mb-2">
                <NavigateButton content="Контрагенты" />
            </div>
            <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-x-2">
                    <SearchProduct
                        search={search}
                        pageType={false}
                        activeType="fullkey"
                        setSearch={setSearch}
                        setSearchFocus={setSearchFocus}
                    />

                    <Select
                        isClearable
                        isSearchable={false}
                        placeholder="Тип контрагента"
                        options={[
                            { value: "is_customer", label: "Клиент" },
                            { value: "is_supplier", label: "Поставщик" },
                        ]}
                        value={
                            filter.is_customer
                                ? { value: "is_customer", label: "Клиент" }
                                : filter.is_supplier
                                  ? { value: "is_supplier", label: "Поставщик" }
                                  : null
                        }
                        onChange={(opt) => {
                            setFilter({
                                is_customer: opt?.value === "is_customer",
                                is_supplier: opt?.value === "is_supplier",
                            });
                        }}
                        styles={{
                            control: (base) => ({ ...base, minWidth: 160 }),
                        }}
                    />
                </div>

                <div className="flex gap-x-2">
                    <Button
                        onClick={() => setIsOpen(true)}
                        variant="solid"
                        size="sm"
                        icon={<FaPlus />}
                    >
                        Добавить контрагента
                    </Button>
                </div>
            </div>

            <div
                className={classNames(
                    "h-[46vh] flex flex-1 flex-col mb-3",
                    !searchFocus ? "h-[82vh]" : "h-[47vh]",
                )}
            >
                <div className="h-full mb-3 border border-slate-300 rounded-lg overflow-auto">
                    {data && data?.length > 0 && !isPending ? (
                        <Table className="min-w-full table-fixed border-separate border-spacing-0">
                            <THead className="sticky top-0">
                                {table.getHeaderGroups().map((headerGroup) => {
                                    return (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map(
                                                (header) => {
                                                    const isActionsColumn =
                                                        header.column.id ===
                                                        "actions";
                                                    return (
                                                                        <Th
                                                            className={classNames(
                                                                "border border-slate-200 bg-slate-100",
                                                                isActionsColumn ? "bg-slate-100" : "",
                                                            )}
                                                            key={header.id}
                                                        >
                                                            <div
                                                                className={classNames(
                                                                    "px-4 py-2 text-left font-medium text-xs xl:text-sm text-slate-800",
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.headerClassName,
                                                                )}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext(),
                                                                )}
                                                            </div>
                                                        </Th>
                                                    );
                                                },
                                            )}
                                        </Tr>
                                    );
                                })}
                            </THead>
                            <TBody>
                                {table.getRowModel().rows.map((row) => (
                                    <Tr
                                        key={row.id}
                                        className="hover:bg-blue-100 transition"
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <Td
                                                    key={cell.id}
                                                    className={classNames(
                                                        "border border-slate-200",
                                                        cell.column.columnDef
                                                            .meta
                                                            ?.bodyCellClassName,
                                                    )}
                                                >
                                                    <div
                                                        className={classNames(
                                                            "py-3 text-xs xl:text-sm px-4",
                                                        )}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
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
                    total={20}
                    pageSize={pagination.pageSize}
                    pageSizeOptions={[20, 50, 100, 1000]}
                    currentPage={pagination.pageIndex}
                    onChange={(page, size) =>
                        setPagination({
                            pageIndex: page,
                            pageSize: size || pagination.pageSize,
                        })
                    }
                />
            </div>

            {searchFocus && <FullKeyboard setSearch={setSearch} />}

            <ContragentModal
                isOpen={isOpen}
                type={type}
                contragent={contragent}
                setContragent={setContragent}
                setIsOpen={setIsOpen}
                setType={setType}
            />

            <PaymentDebtsModal
                dobtModal={dobtModal}
                setDebitModal={setDebitModal}
                contractorId={contractorId}
                setContragentId={setContractorId}
            />

            <Dialog
                title={
                    <div className="w-full flex justify-between">
                        <span>Привязка товаров к поставщику</span>{" "}
                        <div className="flex gap-x-2">
                            <Button
                                size="sm"
                                onClick={closeContractorProductModal}
                            >
                                Назад
                            </Button>
                            <Button
                                onClick={onSave}
                                loading={loading}
                                size="sm"
                                variant="solid"
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                }
                width={"100vw"}
                height={"100vh"}
                contentClassName={"!p-2 !m-0 !rounded-none"}
                closable={false}
                isOpen={isOpenProducts}
            >
                <div className="flex flex-col h-[calc(100vh-80px)]">
                    {/* Search with dropdown */}
                    <div className="mb-2 relative" ref={dropdownRef}>
                        <SearchProduct
                            search={searchContractor}
                            pageType={false}
                            activeType="fullkey"
                            setSearch={setSearchContractor}
                        />

                        {/* Dropdown: only when search is active */}
                        {isDropdownOpen && (
                            <div className="w-1/2 bg-white border absolute z-30 shadow rounded-lg flex flex-col gap-y-1 p-2 max-h-60 overflow-y-auto">
                                {productsPending ? (
                                    <p className="text-sm text-slate-400 px-2 py-1">
                                        Загрузка...
                                    </p>
                                ) : productsData && productsData.length > 0 ? (
                                    productsData?.map((el: any) => (
                                        <p
                                            key={el?.id}
                                            onClick={() => onSelect(el?.id)}
                                            className="px-2 py-2 text-sm rounded hover:bg-slate-100 cursor-pointer transition"
                                        >
                                            {el?.name}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 px-2 py-1">
                                        Товар не найден
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Assigned products list or empty state */}
                    <div className="flex-1 flex flex-col h-full mb-5 overflow-y-auto">
                        {products?.length > 0 ? (
                            <>
                                <div className="flex flex-col gap-y-2">
                                    {products
                                        ?.filter((el: any) =>
                                            el?.product?.name
                                                ?.toLowerCase()
                                                ?.includes(
                                                    searchContractor?.toLowerCase(),
                                                ),
                                        )
                                        ?.map((product: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-x-5 border border-slate-300 rounded-lg px-4 py-2 bg-slate-200"
                                            >
                                                <span className="text-sm text-slate-800">
                                                    {product?.product?.name}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        onDeleteContractorProduct(
                                                            product,
                                                        )
                                                    }
                                                    className="text-red-400 hover:text-red-600 transition"
                                                >
                                                    <IoTrashOutline size={18} />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <Empty size={150} />
                            </div>
                        )}
                    </div>

                    <FullKeyboard setSearch={setSearchContractor} />
                </div>
            </Dialog>

            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title="Вы уверены, что хотите удалить этого контрагента?"
                isOpen={deleteModal}
                confirmButtonProps={{
                    loading: isDeletePending,
                    onClick: onDeleteContragent,
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={() => setDeleteModal(false)}
                onRequestClose={() => setDeleteModal(false)}
                onCancel={() => setDeleteModal(false)}
            >
                <p className="text-gray-600">
                    После удаления восстановить контрагента будет невозможно.
                </p>
            </ConfirmDialog>
        </div>
    );
};

export default Counterparty;

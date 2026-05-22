import { useAllProductApi, useBulkDeleteProduct } from "@/entities/products/repository";
// import type { BulkDeleteResult } from "@/entities/products/api";
import { showErrorMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Input } from "@/shared/ui/kit";
import { useEffect, useRef, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import Loading from "@/shared/ui/loading";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";

interface SelectedProduct {
    id: number;
    name: string;
}

const BulkDeleteModal = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selected, setSelected] = useState<SelectedProduct[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    // const [result, setResult] = useState<BulkDeleteResult | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: products, isFetching } = useAllProductApi(20, 1, debouncedSearch);
    const { mutate: bulkDelete, isPending } = useBulkDeleteProduct();

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [search]);

    const onClose = () => {
        setIsOpen(false);
        setSearch("");
        setDebouncedSearch("");
        setSelected([]);
        // setResult(null);
    };

    const toggle = (product: { id: number; name: string }) => {
        setSelected((prev) => {
            const exists = prev.some((p) => p.id === product.id);
            return exists
                ? prev.filter((p) => p.id !== product.id)
                : [...prev, { id: product.id, name: product.name }];
        });
    };

    const remove = (id: number) => {
        setSelected((prev) => prev.filter((p) => p.id !== id));
    };

    const handleDelete = () => {
        if (!selected.length) return;
        bulkDelete(
            { product_ids: selected.map((p) => p.id) },
            {
                onSuccess() {
                    // setResult(data);
                    setSelected([]);
                    setConfirmOpen(false);
                },
                onError(err) {
                    showErrorMessage(err);
                    setConfirmOpen(false);
                },
            },
        );
    };

    // 80vh - p-6(48px) - sm:my-8(64px) - header(56px) - footer(52px) - gaps(24px) = ~260px overhead
    // when keyboard open: subtract keyboard height (~280px)

    return (
        <>
            <Dialog
                title="Массовое удаление товаров"
                isOpen={isOpen}
                onClose={onClose}
                width="80vw"
                height="90vh"
            >
                {/* {result && (
                    <div className="flex flex-wrap gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 mb-3">
                        <span className="text-green-600 font-medium">
                            Успешно удалено: {result.success_count}
                        </span>
                        {result.failure_count > 0 && (
                            <span className="text-red-500 font-medium">
                                Ошибки: {result.failure_count}
                            </span>
                        )}
                        {result.failures?.map((f) => (
                            <span key={f.id} className="text-xs text-red-400">
                                ID {f.id}: {f.error_message}
                            </span>
                        ))}
                    </div>
                )} */}

                <div className="flex flex-1 gap-3" style={{ height: "calc(90vh - 390px)" }}>
                    {/* Left: search + results */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <Input
                            placeholder="Поиск товаров..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-2 shrink-0"
                        />
                        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg">
                            {isFetching ? (
                                <div className="flex justify-center items-center h-24">
                                    <Loading />
                                </div>
                            ) : products && products.length > 0 ? (
                                products.map((product: any) => {
                                    const isSelected = selected.some((p) => p.id === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => toggle(product)}
                                            className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50 ${isSelected ? "bg-red-50" : ""}`}
                                        >
                                            {isSelected ? (
                                                <MdOutlineCheckBox size={18} className="text-red-500 shrink-0" />
                                            ) : (
                                                <MdOutlineCheckBoxOutlineBlank size={18} className="text-slate-400 shrink-0" />
                                            )}
                                            <span className="text-sm text-slate-800 truncate">{product.name}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex justify-center items-center h-24 text-sm text-slate-400">
                                    {debouncedSearch ? "Товар не найден" : "Введите название для поиска"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: selected */}
                    <div className="w-72 shrink-0 flex flex-col">
                        <div className="mb-2 flex items-center justify-between shrink-0">
                            <span className="text-sm font-medium text-slate-700">Выбрано для удаления</span>
                            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {selected.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg">
                            {selected.length > 0 ? (
                                selected.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-slate-100 last:border-0 hover:bg-red-50 transition-colors"
                                    >
                                        <span className="text-sm text-slate-800 truncate flex-1">{product.name}</span>
                                        <button
                                            onClick={() => remove(product.id)}
                                            className="text-red-400 hover:text-red-600 shrink-0 transition-colors"
                                        >
                                            <IoTrashOutline size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center h-24 text-sm text-slate-400">
                                    Не выбрано
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 my-3 border-t border-slate-200">
                    <Button size="sm" onClick={onClose}>Закрыть</Button>
                    <Button
                        size="sm"
                        variant="solid"
                        className="bg-red-500 hover:bg-red-600"
                        disabled={selected.length === 0}
                        onClick={() => setConfirmOpen(true)}
                        icon={<IoTrashOutline size={16} />}
                    >
                        Удалить ({selected.length})
                    </Button>
                </div>

                <FullKeyboard setSearch={setSearch} />
            </Dialog>

            <ConfirmDialog
                type="danger"
                className="w-[480px]"
                title={`Удалить ${selected.length} товаров?`}
                isOpen={confirmOpen}
                confirmButtonProps={{ loading: isPending, onClick: handleDelete }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={() => setConfirmOpen(false)}
                onRequestClose={() => setConfirmOpen(false)}
                onCancel={() => setConfirmOpen(false)}
            >
                <p className="text-gray-600">После удаления восстановить товары будет невозможно.</p>
            </ConfirmDialog>
        </>
    );
};

export default BulkDeleteModal;

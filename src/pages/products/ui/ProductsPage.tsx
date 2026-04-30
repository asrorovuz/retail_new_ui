import { AccountPermissions } from "@/app/constants/permissions";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
    useAllProductApi,
    useAllProductCountApi,
    useFindBarcodeProduct,
    usePriceTypeApi,
} from "@/entities/products/repository";
import { AddMoreProducts, AddProductModal } from "@/features/modals";
import { ProductHeader, ProductTable } from "@/features/product";
import {
    defaultParams,
    type FilterParams,
} from "@/features/product/select-params";
import UploadExcelFile from "@/features/upload-excel-file";
import { useCheckPermission } from "@/shared/lib/checkPermission";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import { useEffect, useState } from "react";

const ProductsPage = () => {
    const [search, setSearch] = useState("");
    const [searchFocus, setSearchFocus] = useState(false);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [catalogCode, setCatalogCode] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenExcel, setIsOpenExcel] = useState(false);

    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 20,
    });
    const [filterParams, setFilterParams] =
        useState<FilterParams>(defaultParams);

    const debouncedSearch = useDebounce(search, 500);
    const checkPermission = useCheckPermission();

    const { data: productPriceType } = usePriceTypeApi();
    const { data = [], isPending } = useAllProductApi(
        pagination.pageSize,
        pagination.pageIndex,
        debouncedSearch || "",
        filterParams,
    );
    const { data: countData } = useAllProductCountApi(
        debouncedSearch || "",
        filterParams,
    );
    const { data: findBarcodeData } = useFindBarcodeProduct(barcode);

    const { settings } = useSettingsStore((s) => s);

    useEffect(() => {
        const onScan = (code: string) => {
            const val = handleBarcodeScanned(code);
            if (isAddOpen || isOpen) {
                setBarcode(val);
                return;
            }
            setSearch(val);
            setBarcode(val);
        };

        eventBus.on("BARCODE_SCANNED", onScan);

        return () => {
            eventBus.remove("BARCODE_SCANNED", onScan);
        };
    }, []);

    // 2. Barcode bo‘lsa va product topilmasa
    useEffect(() => {
        if (!barcode || isPending) return;
        if (isAddOpen || isOpen) return;

        const found = data?.length > 0;

        if (!found) {
            if (
                !settings?.enable_create_unknown_product ||
                checkPermission(
                    AccountPermissions.AccountPermissionProductCreate,
                )
            ) {
                showErrorLocalMessage("Товар не найден");
                setBarcode(null);
            } else {
                setIsAddOpen(true); // modal ochish
            }
        }
    }, [barcode, data, isPending, settings, isAddOpen, isOpen]);

    // 3. findBarcodeData kelganda catalogCode set qilish
    useEffect(() => {
        if (!barcode) return;
        if (findBarcodeData) {
            setCatalogCode(findBarcodeData.catalog_code);
        } else {
            setCatalogCode(barcode);
        }
    }, [findBarcodeData, barcode]);

    useEffect(() => {
        if (isAddOpen) {
            setSearch("");
        }
    }, [isAddOpen]);

    return (
        <div className="bg-white h-full rounded-2xl p-4">
            <NavigateButton content={"Товары"} />
            <ProductHeader
                search={search}
                setActiveType={() => {}}
                filterParams={filterParams}
                setSearchFocus={setSearchFocus}
                setFilterParams={setFilterParams}
                setIsAddOpen={setIsAddOpen}
                setIsOpen={setIsOpen}
                setSearch={setSearch}
                setBarcode={setBarcode}
                setIsOpenExcel={setIsOpenExcel}
            />
            <ProductTable
                data={data}
                countData={countData ?? 0}
                isPending={isPending}
                searchFocus={searchFocus}
                setSearch={setSearch}
                pagination={pagination}
                setPagination={setPagination}
                barcode={barcode}
                setBarcode={setBarcode}
                setIsOpen={setIsEditOpen}
                isOpen={isEditOpen}
                productPriceType={productPriceType!}
            />

            {searchFocus && <FullKeyboard setSearch={setSearch} />}
            <UploadExcelFile isOpen={isOpenExcel} setIsOpen={setIsOpenExcel} />
            {isAddOpen && (
                <AddProductModal
                    type={"add"}
                    pageType={"products"}
                    setBarcode={setBarcode}
                    catalogCode={catalogCode}
                    setCatalogCode={setCatalogCode}
                    barcode={barcode}
                    isOpen={isAddOpen}
                    setIsOpen={setIsAddOpen}
                    productPriceType={productPriceType!}
                />
            )}
            <AddMoreProducts
                barcode={barcode}
                setBarcode={setBarcode}
                catalogCode={catalogCode}
                productPriceType={productPriceType}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

export default ProductsPage;

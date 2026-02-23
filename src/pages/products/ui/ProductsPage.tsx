import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import { ProductHeader, ProductTable } from "@/features/product";
import {
  defaultParams,
  type FilterParams,
} from "@/features/product/select-params";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenExcel, setIsOpenExcel] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });
  const [filterParams, setFilterParams] = useState<FilterParams>(defaultParams);

  const { data: productPriceType } = usePriceTypeApi();
  const {
    data: findBarcodeData,
    isError,
    isFetching,
    isSuccess,
  } = useFindBarcode(barcode);

  const { settings } = useSettingsStore((s) => s);

  useEffect(() => {
    const onScan = eventBus.on("BARCODE_SCANNED", (code) => {
      const val: string = handleBarcodeScanned(code);
      setBarcode(val);
    });

    return () => {
      eventBus.remove("BARCODE_SCANNED", onScan);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && !isFetching && !isAddOpen && !isOpen && findBarcodeData) {
      setSearch(String(barcode));
      setBarcode(null); // qayta so‘rov yubormaslik uchun tozalaymiz
    }
  }, [isSuccess, findBarcodeData, isFetching]);

  useEffect(() => {
    if (isAddOpen || isOpen) return;
    if (isError) {
      if (settings?.enable_create_unknown_product && !isOpen) {
        setIsAddOpen(true);
      } else {
        showErrorLocalMessage("Товар не найден");
        setBarcode(null);
      }
    }
  }, [isError]);

  return (
    <div className="bg-white h-full rounded-2xl p-4">
      <NavigateButton />
      <ProductHeader
        search={search}
        setActiveType={() => {}}
        filterParams={filterParams}
        setSearchFocus={setSearchFocus}
        setFilterParams={setFilterParams}
        setIsAddOpen={setIsAddOpen}
        setIsOpen={setIsOpen}
        setIsOpenExcel={setIsOpenExcel}
      />
      <ProductTable
        search={search}
        searchFocus={searchFocus}
        setBarcode={setBarcode}
        filterParams={filterParams}
        barcode={barcode}
        setIsOpen={setIsEditOpen}
        isOpen={isEditOpen}
        productPriceType={productPriceType!}
        pagination={pagination}
        setPagination={setPagination}
      />

      {searchFocus && (
        <div className="rounded-2xl bg-slate-200 mb-3 p-1">
          <FullKeyboard setSearch={setSearch} />
        </div>
      )}
      {/* <div className="mb-3 flex items-center gap-x-2">
      </div>
      <AddProductModal
        type={"add"}
        pageType={"products"}
        setBarcode={setBarcode}
        barcode={barcode}
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        productPriceType={productPriceType!}
      />
      <UploadExcelFile isOpen={isOpenExcel} setIsOpen={setIsOpenExcel} />
      <AddMoreProducts
        barcode={barcode}
        setBarcode={setBarcode}
        productPriceType={productPriceType}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />      
       */}
    </div>
  );
};

export default ProductsPage;

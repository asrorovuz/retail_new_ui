import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import { FilterTable } from "@/features/filter-table";
import type { FilterParams } from "@/features/filter-table/ui/options";
import { AddMoreProducts } from "@/features/modals";
import AddProductModal from "@/features/modals/ui/AddProductModal";
import ProductTable from "@/features/products";
import SearchProduct from "@/features/search-product";
import UploadExcelFile from "@/features/upload-excel-file";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { Button } from "@/shared/ui/kit";
import { useEffect, useState } from "react";

// type FilterType = "all" | "white" | "black";
// type FilterOption = {
//   label: string;
//   value: FilterType;
// };

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    is_legal: null, 
    category_exists: null, 
    category_id: null,
    state: null, 
    measurement_code: null,
    sku: null,
    sku_exists: null, 
    code: null,
    code_exists: null, 
    barcode_exists: null, 
    catalog_code_exists: null, 
    sort: null,
    is_selling_at_loss: null, 
  });

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
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div className="mb-3 flex items-center gap-x-2">
        <SearchProduct setSearch={setSearch} search={search} />
        <Button
          size="sm"
          variant="solid"
          type="button"
          icon={<i className="ri-filter-line text-lg" />}
          onClick={() => setOpenFilter(!openFilter)}
        >
          Фильтр
        </Button>
        <UploadExcelFile />
        <AddProductModal
          type={"add"}
          pageType={"products"}
          setBarcode={setBarcode}
          barcode={barcode}
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          productPriceType={productPriceType!}
        />
        <AddMoreProducts
          barcode={barcode}
          setBarcode={setBarcode}
          productPriceType={productPriceType}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
      <FilterTable
        openFilter={openFilter}
        filterParams={filterParams}
        setFilterParams={setFilterParams}
      />
      <ProductTable
        search={search}
        setBarcode={setBarcode}
        filterParams={filterParams}
        barcode={barcode}
        setIsOpen={setIsEditOpen}
        isOpen={isEditOpen}
        productPriceType={productPriceType!}
      />
    </div>
  );
};

export default ProductsPage;

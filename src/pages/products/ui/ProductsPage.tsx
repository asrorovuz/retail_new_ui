import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import { AddMoreProducts } from "@/features/modals";
import AddProductModal from "@/features/modals/ui/AddProductModal";
import ProductTable from "@/features/products";
import SearchProduct from "@/features/search-product";
import UploadExcelFile from "@/features/upload-excel-file";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

type FilterType = "all" | "white" | "black";
type FilterOption = {
  label: string;
  value: FilterType;
};

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [isLegal, setIsLegal] = useState<FilterType>("all");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const options: FilterOption[] = [
    { label: "Все", value: "all" },
    { label: "Белые", value: "white" },
    { label: "Чёрные", value: "black" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh-100px)]">
      <div className="mb-3 flex items-center gap-x-2">
        <SearchProduct setSearch={setSearch} search={search} />
        <ReactSelect<FilterOption>
          options={options}
          value={options.find((o) => o.value === isLegal)}
          onChange={(option) => option && setIsLegal(option.value)}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            singleValue: (base) => ({
              ...base,
              width: "120px",
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999, width: "120px" }),
          }}
        />
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
      <ProductTable
        search={search}
        setBarcode={setBarcode}
        isLegal={isLegal}
        barcode={barcode}
        setIsOpen={setIsEditOpen}
        isOpen={isEditOpen}
        productPriceType={productPriceType!}
      />
    </div>
  );
};

export default ProductsPage;

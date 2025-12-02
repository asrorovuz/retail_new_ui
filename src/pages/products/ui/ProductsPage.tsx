import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import AddProductModal from "@/features/modals/ui/AddProductModal";
import ProductTable from "@/features/products";
import SearchProduct from "@/features/search-product";
import UploadExcelFile from "@/features/upload-excel-file";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "print">("add");

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
    if (isSuccess && !isFetching && !isOpen && findBarcodeData) {
      setSearch(String(barcode));
      setBarcode(null); // qayta so‘rov yubormaslik uchun tozalaymiz
    }
  }, [isSuccess, findBarcodeData, isFetching]);

  useEffect(() => {
    if (isError && !isOpen) {
      if (settings?.enable_create_unknown_product) {
        setIsOpen(true);
      } else {
        showErrorLocalMessage("Товар не найден");
        setBarcode(null);
      }
    }
  }, [isError]);

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh-100px)]">
      <div className="mb-3 flex items-center gap-x-4">
        <SearchProduct setSearch={setSearch} search={search} />
        <UploadExcelFile/>
        <AddProductModal
          type={modalType}
          pageType={"products"}
          setType={setModalType}
          setBarcode={setBarcode}
          barcode={barcode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          productPriceType={productPriceType!}
        />
      </div>
      <ProductTable
        search={search}
        type={modalType}
        setType={setModalType}
        setBarcode={setBarcode}
        barcode={barcode}
        productPriceType={productPriceType!}
      />
    </div>
  );
};

export default ProductsPage;

import { usePriceTypeApi } from "@/entities/products/repository";
import AddProductModal from "@/features/modals/ui/AddProductModal";
import ProductTable from "@/features/products";
import SearchProduct from "@/features/search-product";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "print">("add");

  const { data: productPriceType } = usePriceTypeApi();

  useEffect(() => {
    const onScan = eventBus.on("BARCODE_SCANNED", (code) => {
      const val: string = handleBarcodeScanned(code)
      console.log("🛒 Barcode in Prodaja:", val);
      // shu yerda modal ochish, yoki tovarni topish
      // openModal(code)
      // if()
      setSearch(val)
    });

    return () => eventBus.remove("BARCODE_SCANNED", onScan);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh-100px)]">
      <div className="mb-3 flex items-center gap-x-4">
        <SearchProduct setSearch={setSearch} search={search} />
        <AddProductModal
          type={modalType}
          setType={setModalType}
          setBarcode={setBarcode}
          barcode={barcode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          productPriceType={productPriceType}
        />
      </div>
      <ProductTable
        search={search}
        type={modalType}
        setType={setModalType}
        setBarcode={setBarcode}
        barcode={barcode}
        productPriceType={productPriceType}
      />
    </div>
  );
};

export default ProductsPage;

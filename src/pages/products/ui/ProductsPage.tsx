import { usePriceTypeApi } from "@/entities/products/repository";
import AddProductModal from "@/features/modals/ui/AddProductModal";
import ProductTable from "@/features/products";
import SearchProduct from "@/features/search-product";
import { useState } from "react";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"add" | "edit">("add");

  const { data: productPriceType } = usePriceTypeApi();

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh_-_120px)]">
      <div className="mb-3 flex items-center gap-x-4">
        <SearchProduct setSearch={setSearch} search={search} />
        <AddProductModal
          type={modalType}
          setType={setModalType}
          setBarcode={setBarcode}
          barcode={barcode}
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

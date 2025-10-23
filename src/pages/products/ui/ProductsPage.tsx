import { LikedProducts } from "@/features/modals";
import AddProductModal from "@/features/modals/ui/AddProductModal";
import ProductTable from "@/features/products";
import SearchProduct from "@/features/search-product";
import { useState } from "react";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"add" | "edit">("add");

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh_-_120px)]">
      <div className="mb-3 flex items-center gap-x-4">
        <SearchProduct setSearch={setSearch} search={search} />
        <LikedProducts />
        <AddProductModal
          type={modalType}
          setType={setModalType}
          setBarcode={setBarcode}
          barcode={barcode}
        />
      </div>
      <ProductTable search={search} />
    </div>
  );
};

export default ProductsPage;

import ProductTable from "@/features/products";
import SearchProduct from "@/features/search-product";
import { useState } from "react";

const ProductsPage = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh_-_120px)]">
      <div className="mb-3">
        <SearchProduct setSearch={setSearch} search={search}/>
      </div>
      <ProductTable search={search}/>
    </div>
  );
};

export default ProductsPage;

import FavoritTable from "@/features/favorit-table";
import { LikedProducts } from "@/features/modals";
const FavouriteProductPage = () => {
  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh_-_120px)]">
      <div className="mb-3 flex justify-end items-center gap-x-4">
        <LikedProducts />
      </div>
      <FavoritTable />
    </div>
  );
};

export default FavouriteProductPage;

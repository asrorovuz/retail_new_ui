import FavoritTable from "@/features/favorit-table";
import { LikedProducts } from "@/features/modals";
const FavouriteProductPage = () => {
  return (
    <div className="bg-white h-full rounded-2xl p-4">
      <div className="mb-3 flex justify-end items-center gap-x-4">
        <LikedProducts />
      </div>
      <FavoritTable />
    </div>
  );
};

export default FavouriteProductPage;

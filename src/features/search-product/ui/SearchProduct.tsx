import { Input } from "@/shared/ui/kit";

const SearchProduct = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (v: string) => void;
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <Input
        className="!border-gray-300 pl-10 py-3 text-xs font-medium" // chap tomonda icon uchun joy
        type="search"
        placeholder="Поиск по любому товару"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchProduct;

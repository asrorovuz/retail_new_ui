import { Input } from "@/shared/ui/kit";
import { BsSearch } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const SearchProduct = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (v: string) => void;
}) => {
  return (
    <Input
      className="w-full text-sm font-medium !bg-transparent border-none outline-none ring-0 !focus:ring-0 !focus:border-none !focus:outline-none"
      type="text"
      size="sm"
      suffix={
        search ? (
          <div onClick={() => setSearch("")}>
            <IoMdClose size={22} />
          </div>
        ) : (
          <BsSearch />
        )
      }
      placeholder="Поиск по любому товару"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchProduct;

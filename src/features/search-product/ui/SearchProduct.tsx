import { Input } from "@/shared/ui/kit";

interface SearchProductProps {
  search: string;
  setActiveType: (type: "numeric" | "qwerty") => void;
}

const SearchProduct = ({ search, setActiveType }: SearchProductProps) => {

  return (
    <Input
      value={search ?? ""}
      onFocus={() => setActiveType("qwerty")}
      placeholder="Поиск по любому товару"
    />
  );
};

export default SearchProduct;

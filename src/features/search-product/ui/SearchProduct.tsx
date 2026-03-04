import { Input } from "@/shared/ui/kit";

interface SearchProductProps {
  search: string;
  setActiveType: (type: "numeric" | "qwerty" | "fullkey") => void;
  setSearchFocus?: (val: boolean) => void;
}

const SearchProduct = ({
  search,
  setActiveType,
  setSearchFocus,
}: SearchProductProps) => {
  const onFocusedSearch = () => {
    if (setSearchFocus) {
      setSearchFocus(true);
    }
  };

  const onBlueSearch = () => {
    if (setSearchFocus) {
      setSearchFocus(false);
    }
  };

  return (
    <Input
      value={search ?? ""}
      size="sm"
      onFocus={() => {
        (setActiveType("qwerty"), onFocusedSearch());
      }}
      onBlur={onBlueSearch}
      placeholder="Поиск по любому товару"
    />
  );
};

export default SearchProduct;

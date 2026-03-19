// import { Input } from "@/shared/ui/kit";

// interface SearchProductProps {
//   search: string;
//   setActiveType: (type: "numeric" | "qwerty" | "fullkey") => void;
//   setSearchFocus?: (val: boolean) => void;
// }

// const SearchProduct = ({
//   search,
//   setActiveType,
//   setSearchFocus,
// }: SearchProductProps) => {
//   const onFocusedSearch = () => {
//     if (setSearchFocus) {
//       setSearchFocus(true);
//     }
//   };

//   const onBlueSearch = () => {
//     if (setSearchFocus) {
//       setSearchFocus(false);
//     }
//   };

//   return (
//     <Input
//       value={search ?? ""}
//       size="sm"
//       onFocus={() => {
//         (setActiveType("qwerty"), onFocusedSearch());
//       }}
//       onBlur={onBlueSearch}
//       placeholder="Поиск по любому товару"
//     />
//   );
// };

// export default SearchProduct;
import { Input } from "@/shared/ui/kit";
import { useKeyboard } from "@/app/providers/KeyboardProvider";
import { useEffect, useRef } from "react";

interface SearchProductProps {
  search: string;
  activeType: "numeric" | "qwerty" | "fullkey";
  setSearch: (val: string) => void;
  setActiveType: (type: "numeric" | "qwerty" | "fullkey") => void;
  setSearchFocus?: (val: boolean) => void;
  placeholder?: string;
}

const SearchProduct = ({
  search,
  activeType,
  setSearch,
  setActiveType,
  setSearchFocus,
  placeholder
}: SearchProductProps) => {
  const { registerField, unregisterField } = useKeyboard();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFocusedSearch = () => {
    if (setSearchFocus) {
      setSearchFocus(true);
    }
    registerField({
      type: "qwerty",
      ref: inputRef as React.RefObject<HTMLInputElement>,
      onChange: (val) => setSearch(val),
    });

    setActiveType("qwerty");
  };

  const onBlurSearch = () => {
    if (setSearchFocus) {
      setSearchFocus(false);
    }
    unregisterField();
  };

  useEffect(() => {
    if (activeType !== "qwerty") {
      setSearch("");
    }
  }, [activeType]);

  return (
    <Input
      ref={inputRef}
      value={search ?? ""}
      size="sm"
      readOnly
      onFocus={onFocusedSearch}
      onBlur={onBlurSearch}
      placeholder={placeholder ?? "Поиск по любому товару"}
    />
  );
};

export default SearchProduct;

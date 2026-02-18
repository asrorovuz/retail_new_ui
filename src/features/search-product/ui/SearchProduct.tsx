import { useKeyboard } from "@/app/providers/KeyboardProvider";
import { Input } from "@/shared/ui/kit";
import { useEffect, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const SearchProduct = ({
  search,
  setSearch,
  activeType,
  setActiveType,
}: {
  search: string;
  setSearch: (v: string) => void;
  activeType: "numeric" | "qwerty";
  setActiveType: (type: "numeric" | "qwerty") => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { registerField, unregisterField, blurActiveField } = useKeyboard();

  useEffect(() => {
    if (inputRef.current) {
      registerField({
        type: activeType,
        ref: inputRef as React.RefObject<HTMLInputElement>,
        onChange: (val: string) => setSearch(val),
      });

      return () => unregisterField();
    }
  }, [search]);

  return (
    <Input
      ref={inputRef}
      className="w-full text-xs font-medium !bg-transparent border-none outline-none ring-0 !focus:ring-0 !focus:border-none !focus:outline-none"
      type="text"
      size="sm"
      suffix={
        search ? (
          <div onClick={() => setSearch("")}>
            <IoMdClose size={20} />
          </div>
        ) : (
          <BsSearch />
        )
      }
      placeholder="Поиск по любому товару"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onBlur={blurActiveField}
      onFocus={() => setActiveType("qwerty")}
    />
  );
};

export default SearchProduct;

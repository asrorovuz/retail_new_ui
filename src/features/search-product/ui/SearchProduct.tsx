import { Button, Input } from "@/shared/ui/kit";
import { useKeyboard } from "@/app/providers/KeyboardProvider";
import { useEffect, useRef } from "react";

interface SearchProductProps {
    search: string;
    activeType: "numeric" | "qwerty" | "fullkey";
    setSearch: (val: string) => void;
    setActiveType?: (type: "numeric" | "qwerty" | "fullkey") => void;
    setSearchFocus?: (val: boolean) => void;
    placeholder?: string;
    pageType?: boolean;
}

const SearchProduct = ({
    search,
    activeType,
    setSearch,
    setActiveType,
    setSearchFocus,
    placeholder,
    pageType = true,
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

        if (setActiveType) {
            setActiveType("qwerty");
        }
    };

    const onBlurSearch = () => {
        if (setSearchFocus) {
            setSearchFocus(false);
        }
        unregisterField();
    };

    const buttonABC = () => {
        if (setActiveType) {
            setActiveType("numeric");
        }
        setSearch("");
    };

    useEffect(() => {
        if (activeType !== "qwerty") {
            setSearch("");
        }
    }, [activeType]);

    return (
        <div className="flex gap-1">
            <div className=" gap-1 w-full rounded-lg">
                <Input
                    ref={inputRef}
                    value={search ?? ""}
                    size="sm"
                    className="max-h-[40px] !bg-transparent"
                    onFocus={onFocusedSearch}
                    onBlur={onBlurSearch}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder ?? "Поиск "}
                />
            </div>
            {pageType && (
                <Button onClick={buttonABC} size="sm">
                    ABC
                </Button>
            )}
        </div>
    );
};

export default SearchProduct;

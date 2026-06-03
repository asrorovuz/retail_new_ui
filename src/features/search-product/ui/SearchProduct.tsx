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
    const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingCharsRef = useRef<string[]>([]);
    const isScannerActiveRef = useRef(false);
    const scannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSearchFocusedRef = useRef(false);
    const isSearchModeRef = useRef(false);

    const onFocusedSearch = () => {
        isSearchFocusedRef.current = true;
        isSearchModeRef.current = true;
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
        isSearchFocusedRef.current = false;
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
            isSearchModeRef.current = false;
            setSearch("");
        }
    }, [activeType]);

    useEffect(() => {
        const resetScanner = () => {
            isScannerActiveRef.current = false;
            if (scannerTimeoutRef.current) {
                clearTimeout(scannerTimeoutRef.current);
                scannerTimeoutRef.current = null;
            }
        };
        const handleScannerActive = () => {
            isScannerActiveRef.current = true;
            if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
            focusTimerRef.current = null;
            pendingCharsRef.current = [];
            if (document.activeElement === inputRef.current) {
                inputRef.current?.blur();
                setSearch("");
                if (setActiveType) setActiveType("numeric");
            }
            if (scannerTimeoutRef.current) clearTimeout(scannerTimeoutRef.current);
            scannerTimeoutRef.current = setTimeout(resetScanner, 300);
        };
        const handleScannerComplete = () => {
            resetScanner();
        };
        window.addEventListener("SCANNER_ACTIVE", handleScannerActive);
        window.addEventListener("SCANNER_COMPLETE", handleScannerComplete);
        return () => {
            window.removeEventListener("SCANNER_ACTIVE", handleScannerActive);
            window.removeEventListener("SCANNER_COMPLETE", handleScannerComplete);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isSearchModeRef.current) {
                isSearchModeRef.current = false;
                inputRef.current?.blur();
                setSearch("");
                if (setActiveType) setActiveType("numeric");
                return;
            }

            if (!setActiveType) return;
            if (isScannerActiveRef.current) return;
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;

            pendingCharsRef.current.push(e.key);
            if (focusTimerRef.current) clearTimeout(focusTimerRef.current);

            focusTimerRef.current = setTimeout(() => {
                const chars = pendingCharsRef.current.join("");
                pendingCharsRef.current = [];
                focusTimerRef.current = null;
                setActiveType("qwerty");
                setSearch(chars);
                inputRef.current?.focus();
            }, 50);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setActiveType, setSearch]);

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

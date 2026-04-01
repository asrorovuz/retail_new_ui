import { useKeyboard } from "@/app/providers/KeyboardProvider";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { LuArrowBigUp } from "react-icons/lu";
import { RiDeleteBack2Line, RiSpace } from "react-icons/ri";

interface FullKeyboardProps {
    setSearch?: (value: string | ((prev: string) => string)) => void;
}

const FullKeyboard = ({ setSearch }: FullKeyboardProps) => {
    const [upperLater, setUpperLater] = useState(false);
    const [lang, setLang] = useState("en");
    const { insert, blurActiveField, backspace, clear } = useKeyboard();

    const keysEn = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        ";",
        <LuArrowBigUp />,
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        ".",
    ];

    const keysRu = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "_",
        "й",
        "ц",
        "у",
        "к",
        "е",
        "н",
        "г",
        "ш",
        "щ",
        "з",
        "х",
        "ъ",
        "ф",
        "ы",
        "в",
        "а",
        "п",
        "р",
        "о",
        "л",
        "д",
        "ж",
        "э",
        "\\",
        <LuArrowBigUp />,
        "я",
        "ч",
        "с",
        "м",
        "и",
        "т",
        "ь",
        "б",
        "ю",
        ".",
    ];

    const handleInsert = (value: string) => {
        if (typeof setSearch === "function") {
            setSearch((prev: string) => (prev || "") + value);
        } else {
            insert(value);
        }
    };

    const onBackSpace = () => {
        if (typeof setSearch === "function") {
            setSearch((prev: string) => (prev || "").slice(0, -1));
        } else {
            backspace();
        }
    };

    const onClear = () => {
        if (typeof setSearch === "function") {
            setSearch("");
        } else {
            clear();
        }
    };

    const onWriteSymbol = (sym: string) => {
        if (typeof setSearch === "function") {
            setSearch((prev: string) => (prev || "") + sym);
        } else {
            insert(sym);
        }
    };

    const changeLang = () => setLang((prev) => (prev === "en" ? "ru" : "en"));

    // Physical keyboard support
    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (e.key === "Enter") {
    //             if (typeof setSearch === "function") setSearch("");
    //             else blurActiveField();
    //             return;
    //         }
    //         if (e.key === "Backspace") {
    //             onBackSpace();
    //             return;
    //         }
    //         if (e.key === " ") {
    //             onWriteSymbol(" ");
    //             return;
    //         }
    //         if (e.key === "Shift") {
    //             setUpperLater((prev) => !prev);
    //             return;
    //         }

    //         if (e.key.length === 1) {
    //             const char = upperLater ? e.key.toUpperCase() : e.key;
    //             onWriteSymbol(char);
    //         }
    //     };

    //     window.addEventListener("keyup", handleKeyDown);
    //     return () => window.removeEventListener("keyup", handleKeyDown);
    // }, [upperLater, onWriteSymbol, onBackSpace]);

    const keys = lang === "en" ? keysEn : keysRu;

    return (
        <div className="h-[31.88vh] shadow-lg rounded-md bg-slate-200 p-1 relative z-50">
            <div
                className={classNames(
                    "grid grid-rows-3 gap-1 mb-1",
                    lang === "en" ? "grid-cols-10" : "grid-cols-12",
                )}
            >
                {keys.map((key, index) => {
                    if (typeof key === "string") {
                        return (
                            <Button
                                key={index}
                                variant="solid"
                                className="w-full h-[42px] bg-white font-medium text-xl text-slate-800 hover:bg-blue-50 transition-all"
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleInsert(
                                        upperLater ? key.toUpperCase() : key,
                                    );
                                }}
                            >
                                {upperLater ? key.toUpperCase() : key}
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={index}
                            variant="solid"
                            className="w-full h-[42px] bg-white font-medium text-xl text-slate-800 hover:bg-blue-50 transition-all"
                            type="button"
                            icon={key}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setUpperLater((prev) => !prev);
                            }}
                        />
                    );
                })}

                <Button
                    variant="solid"
                    className="w-full h-[42px] bg-white font-medium text-xl text-slate-800 hover:bg-blue-50 transition-all"
                    type="button"
                    icon={<RiDeleteBack2Line />}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onBackSpace();
                    }}
                />
            </div>

            <div className="grid grid-cols-10 gap-1">
                <Button
                    variant="solid"
                    type="button"
                    className="bg-white h-[42px] text-slate-800 font-medium text-xs w-full hover:bg-blue-50 transition-all"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        changeLang();
                    }}
                >
                    РУС
                </Button>

                <Button
                    variant="solid"
                    type="button"
                    className="bg-white h-[42px] text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol("#");
                    }}
                >
                    #
                </Button>

                <Button
                    variant="solid"
                    type="button"
                    className="bg-white h-[42px] text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol("%");
                    }}
                >
                    %
                </Button>

                <Button
                    variant="solid"
                    type="button"
                    icon={<RiSpace />}
                    className="bg-white h-[42px] col-span-3 text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol(" ");
                    }}
                />

                <Button
                    variant="solid"
                    type="button"
                    icon={<AiOutlineEnter />}
                    className="bg-white h-[42px] col-span-2 text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
                    onClick={() => {
                        blurActiveField();
                    }}
                />

                <Button
                    variant="solid"
                    type="button"
                    className="bg-white h-[42px] col-span-2 text-slate-800 font-medium text-sm w-full hover:bg-blue-50 transition-all"
                    onClick={() => {
                        onClear();
                    }}
                >
                    {lang === "ru" ? "Очистить" : "Clear"}
                </Button>
            </div>
        </div>
    );
};

export default FullKeyboard;

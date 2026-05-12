import { useKeyboard } from "@/app/providers/KeyboardProvider";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
// import { AiOutlineEnter } from "react-icons/ai";
import { LuArrowBigUp } from "react-icons/lu";
import { RiDeleteBack2Line, RiSpace } from "react-icons/ri";

interface FullKeyboardProps {
    setSearch?: (value: string | ((prev: string) => string)) => void;
}

const FullKeyboard = ({ setSearch }: FullKeyboardProps) => {
    const [upperLater, setUpperLater] = useState(false);
    const [lang, setLang] = useState("en");
    const { insert, backspace, clear } = useKeyboard();

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
        "back",
    ];

    const keysRu = [
        "ё",
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
        "back",
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
        "я",
        <LuArrowBigUp />,
        "/",
        "ч",
        "с",
        "м",
        "и",
        "т",
        "ь",
        "б",
        "ю",
        "_",
        "-",
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
            clear();
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

    const keys = lang === "en" ? keysEn : keysRu;

    const keyClass =
        "relative overflow-hidden w-full h-[38px] " +
        "text-[14px] font-medium text-black " +
        "rounded " +
        "!bg-[#ffffff] " +
        "hover:bg-blue-200 active:!bg-blue-300 "

    return (
        <div className="bg-[#d1d5db] p-2 rounded-2xl shadow-inner">
            {/* Keys */}
            <div
                className={classNames(
                    "grid grid-rows-3 gap-0.5 mb-0.5",
                    lang === "en" ? "grid-cols-10" : "grid-cols-12",
                )}
            >
                {keys.map((key, index) => {
                    if (typeof key === "string" && key !== "back") {
                        return (
                            <Button
                                key={index}
                                variant="solid"
                                className={keyClass}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleInsert(
                                        upperLater ? key.toUpperCase() : key,
                                    );
                                }}
                            >
                                {/* Ripple */}

                                {upperLater ? key.toUpperCase() : key}
                            </Button>
                        );
                    } else if (typeof key === "string" && key === "back") {
                        return (
                            <Button
                                variant="solid"
                                className={classNames(keyClass)}
                                type="button"
                                icon={<RiDeleteBack2Line />}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onBackSpace();
                                }}
                            />
                        );
                    }

                    return (
                        <Button
                            key={index}
                            variant="solid"
                            className={classNames(
                                keyClass,
                                upperLater && "bg-[#c7d2fe]",
                            )}
                            type="button"
                            icon={key}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setUpperLater((prev) => !prev);
                            }}
                        />
                    );
                })}
            </div>

            {/* Bottom */}
            <div className="grid grid-cols-6 gap-0.5">
                <Button
                    variant="solid"
                    type="button"
                    className={classNames(keyClass, "bg-[#e5e7eb]")}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        changeLang();
                    }}
                >
                    {lang === "ru" ? "ENG" : "РУС"}
                </Button>

                <Button
                    variant="solid"
                    type="button"
                    className={keyClass}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol("/");
                    }}
                >
                    /
                </Button>

                <Button
                    variant="solid"
                    type="button"
                    icon={<RiSpace />}
                    className={classNames(keyClass, "col-span-2")}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol(" ");
                    }}
                />

                <Button
                    variant="solid"
                    type="button"
                    className={keyClass}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol(".");
                    }}
                >
                    .
                </Button>
                {/* <Button
                    variant="solid"
                    type="button"
                    icon={<AiOutlineEnter />}
                    className={classNames(keyClass, "bg-[#e5e7eb]")}
                    onMouseDown={() => {
                        blurActiveField();
                    }}
                /> */}

                <Button
                    variant="solid"
                    type="button"
                    className={classNames(keyClass, "bg-[#e5e7eb]")}
                    onMouseDown={(e) => {
                        e.preventDefault();
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

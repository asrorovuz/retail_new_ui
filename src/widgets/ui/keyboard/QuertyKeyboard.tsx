import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { LuArrowBigUp } from "react-icons/lu";
import { RiDeleteBack2Line, RiSpace } from "react-icons/ri";

const QuertyKeyboard = ({ setActiveType, setSearch }: any) => {
    const [upperLater, setUpperLater] = useState(true);
    const [lang, setLang] = useState("en");

    // 🍏 iOS key style
    const keyClass =
        "w-full h-10 p-0 text-[17px] font-medium " +
        "rounded " +
        "bg-[#ffffff] text-black " +
        "hover:bg-[#f2f2f2] " +
        "active:bg-blue-200 "

    const keysEn = [
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

    const changeLang = () => {
        setLang((prev) => (prev === "en" ? "ru" : "en"));
    };

    const onBackSpace = () => {
        setSearch((prev: string) => prev.slice(0, -1));
    };

    const onWriteSymbol = (sym: string) => {
        setSearch((prev: string) => prev + sym);
    };

    return (
        <div className="h-max p-2 rounded-2xl bg-[#d1d5db]">
            {/* Keys */}
            <div
                className={classNames(
                    "grid grid-rows-3 gap-0.5 mb-0.5",
                    lang === "en" ? "grid-cols-10" : "grid-cols-12",
                )}
            >
                {(lang === "en" ? keysEn : keysRu).map((key, index) => {
                    if (typeof key === "string") {
                        return (
                            <Button
                                key={index}
                                className={keyClass}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSearch(
                                        (prev: string) =>
                                            (prev || "") +
                                            (upperLater
                                                ? key.toUpperCase()
                                                : key),
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
                            className={classNames(
                                keyClass,
                                "bg-[#e5e7eb]",
                                upperLater && "bg-[#c7d2fe]",
                            )}
                            type="button"
                            icon={key}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setUpperLater(!upperLater);
                            }}
                        />
                    );
                })}

                {/* Backspace */}
                <Button
                    className={classNames(keyClass, "bg-[#e5e7eb]")}
                    type="button"
                    icon={<RiDeleteBack2Line />}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onBackSpace();
                    }}
                />
            </div>

            {/* Bottom */}
            <div className="grid grid-cols-10 gap-0.5">
                <div className="grid grid-cols-2 col-span-3">
                    <Button
                    className={classNames(keyClass, "bg-[#e5e7eb] text-xs")}
                    onClick={() => setActiveType("numeric")}
                >
                    123
                </Button>

                <Button
                    className={classNames(keyClass, "bg-[#e5e7eb] text-xs")}
                    onClick={changeLang}
                >
                    {lang === "ru" ? "ENG" : "РУС"}
                </Button>
                </div>

                <Button
                    className={keyClass}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol("-");
                    }}
                >
                    -
                </Button>

                <Button
                    icon={<RiSpace />}
                    className={classNames(keyClass, "col-span-2")}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onWriteSymbol(" ");
                    }}
                />

                <Button
                    icon={<AiOutlineEnter />}
                    className={classNames(keyClass, "col-span-2 bg-[#e5e7eb]")}
                    onMouseDown={() => {
                        setActiveType("numeric");
                        setSearch("");
                    }}
                />

                <Button
                    className={classNames(
                        keyClass,
                        "col-span-2 bg-[#e5e7eb] text-sm",
                    )}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setSearch("");
                    }}
                >
                    {lang === "ru" ? "Очистить" : "Clear"}
                </Button>
            </div>
        </div>
    );
};

export default QuertyKeyboard;

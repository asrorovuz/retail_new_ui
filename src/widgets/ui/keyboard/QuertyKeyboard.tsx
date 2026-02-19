import { useKeyboard } from "@/app/providers/KeyboardProvider";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { IoCaretBackOutline, IoCaretForwardOutline } from "react-icons/io5";
import { LuArrowBigUp } from "react-icons/lu";
import { RiDeleteBack2Line, RiSpace } from "react-icons/ri";

const QuertyKeyboard = ({ setActiveType, setSearch }: any) => {
  const { blurActiveField } = useKeyboard();
  const [upperLater, setUpperLater] = useState(false);
  const [lang, setLang] = useState("en");

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
    if (lang === "en") {
      setLang("ru");
    }

    if (lang === "ru") {
      setLang("en");
    }
  };

  const onBackSpace = () => {
    setSearch((prev: string) => prev.slice(0, -1));
  };

  const onWriteSymbol = (sym: string) => {
    setSearch((prev: string) => prev + sym);
  };

  return (
    <div className="h-[28vh]">
      <div
        className={classNames(
          "grid grid-rows-3 gap-1 mb-1",
          lang === "en" ? "grid-cols-10" : "grid-cols-12",
        )}
      >
        {(lang === "en" ? keysEn : keysRu)?.map((key, index) => {
          if (typeof key === "string") {
            return (
              <Button
                key={index}
                variant="solid"
                className="w-full h-12 bg-white font-medium text-xl text-slate-800 hover:bg-blue-50 transition-all"
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearch(
                    (prev: string) =>
                      (prev || "") + (upperLater ? key.toUpperCase() : key),
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
              className="w-full h-12 bg-white font-medium text-xl text-slate-800 hover:bg-blue-50 transition-all"
              type="button"
              icon={key}
              onMouseDown={(e) => {
                e.preventDefault();
                setUpperLater(!upperLater);
              }}
            />
          );
        })}

        <Button
          variant="solid"
          className="w-full h-12 bg-white font-medium text-xl text-slate-800 hover:bg-blue-50 transition-all"
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
          className="bg-white h-12 text-slate-800 font-medium text-xs w-full hover:bg-blue-50 transition-all"
          onClick={() => setActiveType("numeric")}
        >
          123
        </Button>
        <Button
          variant="solid"
          className="bg-white h-12 text-slate-800 font-medium text-xs w-full hover:bg-blue-50 transition-all"
          onClick={changeLang}
        >
          РУС
        </Button>
        {/* <Button
          variant="solid"
          icon={<IoCaretBackOutline />}
          className="bg-white h-12 text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
          onClick={() => blurActiveField()}
        />
        <Button
          variant="solid"
          icon={<IoCaretForwardOutline />}
          className="bg-white h-12 text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
          onClick={() => blurActiveField()}
        /> */}
        <Button
          variant="solid"
          icon={<RiSpace />}
          className="bg-white h-12 col-span-3 text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
          onMouseDown={(e) => {
            e.preventDefault();
            onWriteSymbol(" ");
          }}
        />
        <Button
          variant="solid"
          className="bg-white h-12 text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
          onMouseDown={(e) => {
            e.preventDefault();
            onWriteSymbol("-");
          }}
        >
          -
        </Button>
        <Button
          variant="solid"
          icon={<AiOutlineEnter />}
          className="bg-white h-12 col-span-2 text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
          onClick={() => {
            setActiveType("numeric");
            setSearch("");
          }}
        />
        <Button
          variant="solid"
          className="bg-white h-12 col-span-2 text-slate-800 font-medium text-sm w-full hover:bg-blue-50 transition-all"
          onClick={() => {
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

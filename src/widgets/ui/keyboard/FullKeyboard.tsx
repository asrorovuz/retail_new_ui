import { useKeyboard } from "@/app/providers/KeyboardProvider";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { LuArrowBigUp } from "react-icons/lu";
import { RiDeleteBack2Line, RiSpace } from "react-icons/ri";

const FullKeyboard = ({ setSearch }: any) => {
  const [upperLater, setUpperLater] = useState(false);
  const [lang, setLang] = useState("en");
  const { insert, blurActiveField } = useKeyboard();

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
      setSearch((prev: string) => prev + value);
    } else {
      insert(value);
    }
  };

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
    <div className="h-[31.88vh] shadow-lg rounded-md bg-slate-200 p-1 relative z-50">
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
                className="w-full h-[42px] bg-white font-medium text-xl text-slate-800 hover:bg-blue-50 transition-all"
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleInsert(upperLater ? key.toUpperCase() : key);
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
                setUpperLater(!upperLater);
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
        {/* <Button
           variant="solid"
           icon={<IoCaretBackOutline />}
           className="bg-white h-[42px] text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
           onClick={() => blurActiveField()}
         />
         <Button
           variant="solid"
           icon={<IoCaretForwardOutline />}
           className="bg-white h-[42px] text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
           onClick={() => blurActiveField()}
         /> */}
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
            onWriteSymbol("#");
          }}
        >
          %
        </Button>
        <Button
          variant="solid"
          icon={<RiSpace />}
          type="button"
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
          onMouseDown={() => {
            blurActiveField()
          }}
        />
        <Button
          variant="solid"
          type="button"
          className="bg-white h-[42px] col-span-2 text-slate-800 font-medium text-sm w-full hover:bg-blue-50 transition-all"
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

export default FullKeyboard;

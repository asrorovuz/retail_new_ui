import { useKeyboard } from "@/app/providers/KeyboardProvider";
import { Button } from "@/shared/ui/kit";
import { AiOutlineEnter } from "react-icons/ai";

const NumericKeyboard = ({
    onClickNumber,
}: {
    onClickNumber?: (key: string) => void;
}) => {
    const { insert, blurActiveField } = useKeyboard();

    const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];

    return (
        <div className="h-[31vh] grid grid-cols-3 grid-rows-4 gap-0.5">
            {keys.map((key) => (
                <Button
                    key={key}
                    variant="solid"
                    className="!bg-white h-full font-medium text-xl text-slate-800 hover:bg-blue-50 "
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        // MUHIM: onClickNumber ni chaqirmaymiz, balki funksiyani yuboramiz
                        insert(key, () => onClickNumber?.(key));
                    }}
                >
                    {key}
                </Button>
            ))}

            <Button
                variant="solid"
                icon={<AiOutlineEnter size={24} />}
                className="!bg-white h-full text-slate-800 font-medium text-xl w-full hover:bg-blue-50 transition-all"
                onMouseDown={(e) => {
                    e.preventDefault();
                    blurActiveField();
                }}
            />
        </div>
    );
};

export default NumericKeyboard;

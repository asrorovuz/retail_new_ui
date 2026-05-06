import NumericKeyboard from "./NumericKeyboard";
import QuertyKeyboard from "./QuertyKeyboard";
import FullKeyboard from "./FullKeyboard";

interface KeyboardSwitcherProps {
    onClickNumber?: (num: string) => void;
    activeType?: "numeric" | "qwerty" | "fullkey" | null;
    setActiveType?: (type: "numeric" | "qwerty" | "fullkey") => void;
    setSearch?: any;
}

export const KeyboardSwitcher: React.FC<KeyboardSwitcherProps> = ({
    onClickNumber,
    activeType,
    setActiveType,
    setSearch,
}) => {
    if (!activeType) return null;

    return (
        <>
            {activeType === "numeric" && (
                <NumericKeyboard onClickNumber={onClickNumber} />
            )}

            {activeType === "qwerty" && (
                <QuertyKeyboard
                    setActiveType={setActiveType}
                    setSearch={setSearch}
                />
            )}

            {activeType === "fullkey" && <FullKeyboard setSearch={setSearch} />}
        </>
    );
};

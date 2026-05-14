import { type FC } from "react";
import type { CashboxPropsType } from "../model";
import Tabs from "@/shared/ui/kit-pro/tabs/Tabs";

const Cashbox: FC<CashboxPropsType> = (props) => {
    return (
        <div className="p-1 rounded-lg flex items-center justify-between gap-x-2 bg-slate-200">
            <Tabs {...props} />
        </div>
    );
};

export default Cashbox;

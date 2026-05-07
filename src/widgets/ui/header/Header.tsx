import { useAuthContext } from "@/app/providers/AuthProvider";
import { useVersionStore } from "@/app/store/useVersionStore";
import UpdateVersion from "@/features/update";

const Header = () => {
    const { versions } = useVersionStore();
    const { user } = useAuthContext();

    const formatted = user?.username?.replace(
        /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
        "+$1 ($2) $3-$4-$5",
    );

    return (
        <div className="flex gap-x-1">
            <div className="w-full rounded-lg text-slate-800 bg-slate-200 h-10 flex justify-between items-center px-3">
                <div className="flex items-center">
                    В: <span>{versions ? versions : "-"}</span>
                </div>
                <div className="flex gap-1 items-center">
                    <div className="flex items-end flex-wrap gap-x-2">
                        <p className="capitalize">
                            {user?.type === 1 ? "админ" : "сотрудник"}:
                        </p>
                        <p>{formatted}</p>
                    </div>
                </div>
            </div>
            <UpdateVersion />
        </div>
    );
};

export default Header;

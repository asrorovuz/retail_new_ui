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
        <div className="rounded-2xl text-slate-800 bg-slate-200 h-10 flex justify-between items-center font-semibold px-3">
            <div className="flex items-center">
                В: <span>{versions ? versions : "-"}</span>
            </div>
            <div className="flex gap-2 items-center">
                <UpdateVersion />
                <div className="flex flex-col items-end">
                    <p>{formatted}</p>
                    <p>{user?.type === 1 ? "Admin" : "Hodim"}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;

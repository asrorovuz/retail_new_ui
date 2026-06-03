import { useOfflineStore } from "@/app/store/useOfflineStore";

export const OfflineBanner = () => {
    const { isOnline, queueLength } = useOfflineStore();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span>
                Server bilan aloqa uzildi
                {queueLength > 0 && (
                    <span className="ml-1 opacity-90">
                        — {queueLength} ta amal sinxronizatsiya kutmoqda
                    </span>
                )}
            </span>
        </div>
    );
};

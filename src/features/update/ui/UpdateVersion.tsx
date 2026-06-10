import { useUpdateProject } from "@/shared/lib/useUpdateProject";
import { Button, Dialog } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import { IoNotificationsOutline } from "react-icons/io5";

const typeNameMap: Record<string, string> = {
    HippoService: "Asosiy server",
    LocalPosRetail: "Kassa dasturi",
};

const parseReleaseNotes = (notes?: string): string[] => {
    if (!notes?.trim()) return [];
    return notes
        .split("-")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
};

const UpdateVersion = () => {
    const {
        updateDialogOpen,
        setUpdateDialogOpen,
        updates,
        loading,
        onSendUpdates,
    } = useUpdateProject();

    const hasUpdates = updates.length > 0;
    const hasCritical = updates.some((u) => u.is_critical);

    return (
        <>
            <Button
                className="relative w-14"
                icon={<IoNotificationsOutline />}
                size="sm"
                onClick={() => setUpdateDialogOpen(true)}
            >
                {hasUpdates && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-5 w-5 rounded-full bg-red-500 text-white text-[10px] items-center justify-center font-medium">
                            {updates.length}
                        </span>
                    </span>
                )}
            </Button>

            <Dialog
                width={490}
                title="Yangilanish mavjud"
                isOpen={updateDialogOpen}
                closable={!hasCritical && !loading}
                shouldCloseOnOverlayClick={!hasCritical && !loading}
                shouldCloseOnEsc={!hasCritical && !loading}
                onClose={() => setUpdateDialogOpen(false)}
            >
                {hasCritical && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span className="mt-0.5 text-base leading-none">⚠️</span>
                        <span>
                            Muhim yangilanish — tizimning to'g'ri ishlashi uchun
                            zudlik bilan yangilang.
                        </span>
                    </div>
                )}

                <div className="flex flex-col gap-3 overflow-y-auto max-h-[55vh]">
                    {updates.length > 0 ? (
                        updates.map((u, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-semibold text-slate-800">
                                        {typeNameMap[u.type] ?? u.type}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {u.version && (
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                v{u.version}
                                            </span>
                                        )}
                                        {u.is_critical && (
                                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                                Muhim
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {(() => {
                                    const items = parseReleaseNotes(u.release_notes);
                                    return items.length > 0 ? (
                                        <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
                                            {items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-1.5">
                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            Barqarorlik va ishlash tezligi yaxshilandi.
                                        </p>
                                    );
                                })()}
                            </div>
                        ))
                    ) : (
                        <Empty
                            size={120}
                            text="Yangilanishlar yo'q."
                            textSize="20px"
                        />
                    )}
                </div>

                <div className="flex justify-end mt-6">
                    <Button loading={loading} onClick={onSendUpdates}>
                        Yangilash
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default UpdateVersion;

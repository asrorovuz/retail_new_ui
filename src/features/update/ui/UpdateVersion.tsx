import { useUpdateProject } from "@/shared/lib/useUpdateProject";
import { Button, Dialog } from "@/shared/ui/kit";

const UpdateVersion = () => {
  const {
    updateDialogOpen,
    setUpdateDialogOpen,
    updates,
    loading,
    onSendUpdates,
  } = useUpdateProject();

  const hasUpdates = updates.length > 0;

  return (
    <>
      {hasUpdates && (
        <Button
          variant="plain"
          className="text-red-500 border-2 border-red-500 hover:text-red-500 relative px-3"
          onClick={() => setUpdateDialogOpen(true)}
        >
          <span className="text-xl">{/* <LuListRestart /> */}</span>
          {/* Badge */}
          <span className="absolute -top-2 -right-2 flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-5 w-5 rounded-full bg-red-500 text-white text-[10px] items-center justify-center font-medium">
              {updates?.length || 0}
            </span>
          </span>
        </Button>
      )}

      {/* 🔔 Versiya yangilash */}
      <Dialog
        title="Обновление версии проекта"
        isOpen={updateDialogOpen}
        closable={!loading}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        onClose={() => setUpdateDialogOpen(false)}
      >
        <ul className="list-disc pl-5 overflow-y-auto max-h-[60vh] flex flex-col gap-y-2">
          {updates.map((u, i) => (
            <div
              className={`${
                i >= 1 ? "border-t border-gray-300 pb-2" : "border-none"
              }`}
            >
              <b className="text-blue-400">
                {u.type === "HippoService" ? "Веб-сервер" : "Веб-UI"}
              </b>
              <li key={i + "0"}>
                <b>Версия: {u.version}</b>
              </li>
              <li key={i + "1"}>
                <b>Примечания к выпуску:</b> {u.release_notes}
              </li>
            </div>
          ))}
        </ul>

        <div>
          <Button loading={loading} onClick={onSendUpdates}>Обновить</Button>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateVersion;

import { useEffect, useState } from "react";
import eventBus from "./eventBus";
import { ipcFetch } from "@/app/config/axios";
import { NOTIFY_NEW_VERSION } from "@/app/constants/version.message";

type UpdateInfo = {
  device_id: string;
  type: string;
  os_type: number;
  version?: string;
  release_notes?: string;
};

export const useUpdateProject = () => {
  const [updates, setUpdates] = useState<UpdateInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    const onAvailable = eventBus.on(
      NOTIFY_NEW_VERSION,
      (payload: UpdateInfo) => {
        const newUpdate: UpdateInfo = {
          device_id: payload.device_id,
          type: payload.type,
          os_type: payload.os_type,
          version: payload.version,
          release_notes: payload.release_notes,
        };

        setUpdates((prev) => {
          const index = prev.findIndex((u) => u.type === newUpdate.type);

          if (index !== -1) {
            // agar shu type mavjud bo‘lsa → update
            const updated = [...prev];
            updated[index] = newUpdate;
            return updated;
          }

          // agar mavjud bo‘lmasa → qo‘shamiz
          return [...prev, newUpdate];
        });
      },
    );

    return () => {
      eventBus.remove(NOTIFY_NEW_VERSION, onAvailable);
    };
  }, []);

  const onSendUpdates = async () => {
    setLoading(true);
    try {
      await ipcFetch({
        url: "/api/auto-updater/restart",
        method: "POST",
        data: updates, // arrayni yuborish
      });
      setUpdates([]); // yuborilgandan keyin tozalash
      setUpdateDialogOpen(false);
      setLoading(false);
    } catch (err) {
      setUpdates([]); // yuborilgandan keyin tozalash
      setUpdateDialogOpen(false);
      setLoading(false);
    }
  };

  return {
    updates,
    setUpdates,
    updateDialogOpen,
    onSendUpdates,
    loading,
    setUpdateDialogOpen,
  };
};

import { useEffect, type ReactNode } from "react";
import EventBus from "./eventBus";
import { NOTIFY_NEW_VERSION } from "@/app/constants/version.message";
const MessageDispatcher = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const handler = ({ name, payload }: any) => {
      if (name === NOTIFY_NEW_VERSION) {
        EventBus.dispatch(NOTIFY_NEW_VERSION, payload);
      }
    };

    // astilectron mavjud bo‘lsa, onMessage ishlatamiz
    if (window.astilectron?.onMessage) {
      window.astilectron.onMessage(handler);
    }

    return () => {
      EventBus.remove(NOTIFY_NEW_VERSION, handler);
    };
  }, []);

  return children;
};

export default MessageDispatcher;

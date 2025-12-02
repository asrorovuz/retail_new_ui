import { ERROR_MESSAGES } from "@/app/constants/message.request";

export const handleError = (err: any, index: number, setErrorStatus: any) => {
    const payload = err?.response?.data ?? {};
    const keys = Object.keys(payload);

    const msgs: string[] = [];

    // Agar oddiy string bo‘lsa
    if (typeof err === "string") {
      if (ERROR_MESSAGES[err]) {
        msgs.push(ERROR_MESSAGES[err]);
      } else {
        msgs.push(err);
      }
    }

    keys.forEach((key) => {
      const val = payload[key];

      if (ERROR_MESSAGES[key]) {
        msgs.push(ERROR_MESSAGES[key]);
      } else if (typeof val === "string") {
        msgs.push(ERROR_MESSAGES[val] || val);
      } else if (typeof val === "boolean") {
        const boolKey = `${key}.${val}`;
        if (ERROR_MESSAGES[boolKey]) {
          msgs.push(ERROR_MESSAGES[boolKey]);
        } else if (ERROR_MESSAGES[key]) {
          msgs.push(ERROR_MESSAGES[key]);
        } else {
          msgs.push(`${key}: ${val}`);
        }
      } else if (Array.isArray(val)) {
        val.forEach((v) => msgs.push(ERROR_MESSAGES[v] || String(v)));
      }
    });

    const text = msgs.length
      ? msgs.join("; ")
      : err?.message || "❌ Неизвестная ошибка";

    setErrorStatus((prev: any) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };
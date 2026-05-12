export const formattedPhone = (val: string | null): string => {
    if (!val) return "—";

    const digits = val.replace(/\D/g, "");

    // +998 90 123 45 67
    if (digits?.length === 12 && digits.startsWith("998")) {
        return `+${digits.slice(0, 3)} (${digits.slice(3, 5)}) ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
    }

    // fallback — as is
    return val;
};

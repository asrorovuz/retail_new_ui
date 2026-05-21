import * as XLSX from "xlsx";

export function exportToExcel(
    data: (string | number | null)[][],
    fileName: string,
) {
    // 2D massivni jadvalga o‘tkazamiz
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // workbook yaratamiz
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // faylni yuklab olish
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export const exportToExcelApi = (
    file: Blob | ArrayBuffer | Uint8Array | { data: number[] } | unknown,
    fileName: string,
): void => {
    try {
        let uint8Array: Uint8Array;

        if (file instanceof Uint8Array) {
            uint8Array = file;
        } else if (file instanceof ArrayBuffer) {
            uint8Array = new Uint8Array(file);
        } else if (file instanceof Blob) {
            // Blob → ArrayBuffer → Uint8Array
            file.arrayBuffer().then((buffer) => {
                const workbook = XLSX.read(new Uint8Array(buffer), {
                    type: "array",
                });
                XLSX.writeFile(workbook, `${fileName}.xlsx`);
            });
            return;
        } else if (
            file !== null &&
            typeof file === "object" &&
            "data" in (file as object)
        ) {
            // Electron IPC: { data: number[] }
            uint8Array = new Uint8Array((file as { data: number[] }).data);
        } else {
            console.error("Kutilmagan ma'lumot turi:", typeof file, file);
            return;
        }

        // XLSX orqali yozish — Electron va Browserda ishlaydi
        const workbook = XLSX.read(uint8Array, { type: "array" });
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error("Excel eksport xatosi:", error);
    }
};

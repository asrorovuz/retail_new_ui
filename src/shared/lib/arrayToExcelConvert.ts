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
            file.arrayBuffer().then((buffer) => {
                downloadXlsxBlob(new Uint8Array(buffer), fileName);
            });
            return;
        } else if (Array.isArray(file)) {
            uint8Array = new Uint8Array(file as number[]);
        } else if (
            file !== null &&
            typeof file === "object" &&
            "data" in (file as object)
        ) {
            uint8Array = new Uint8Array((file as { data: number[] }).data);
        } else {
            console.error("Kutilmagan ma'lumot turi:", typeof file, file);
            return;
        }

        downloadXlsxBlob(uint8Array, fileName);
    } catch (error) {
        console.error("Excel eksport xatosi:", error);
    }
};

// XLSX.writeFile o'rniga Blob + <a> — Electron va Browserda ishlaydi
function downloadXlsxBlob(uint8Array: Uint8Array, fileName: string): void {
    const blob = new Blob([uint8Array as any], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

import * as XLSX from "xlsx";

export function exportToExcel(
  data: (string | number | null)[][],
  fileName: string
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
  file: Blob,
  fileName: string
): void => {
  if (!(file instanceof Blob)) {
    console.error("Полученные данные не являются файлом");
    return;
  }

  const url = window.URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xlsx`;
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};
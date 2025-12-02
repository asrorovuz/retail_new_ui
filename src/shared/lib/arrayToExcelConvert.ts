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

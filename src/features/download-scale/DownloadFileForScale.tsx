import { useExportProductScaleApi } from "@/entities/products/repository";
import { showErrorMessage } from "@/shared/lib/showMessage";
import { Button, Dropdown } from "@/shared/ui/kit";
import * as XLSX from "xlsx";

enum TypeScales {
  ShtrixmExportFormat = 1, // txt
  RongtaExportFormat = 2, // excel
  TmaExportFormat = 3, // excel
  ThePosExportFormat = 4, // txt
}

const DownloadFileForScales = () => {
  const { mutateAsync } = useExportProductScaleApi();

  const handleDownload = async (type: TypeScales) => {
    try {
      const res = await mutateAsync({ format: type });

      let fileName = "Файл"; // default nom

      if (type === TypeScales.RongtaExportFormat) {
        fileName = "Экспорт_Ронгта";
        const data = new Uint8Array(res);
        const workbook = XLSX.read(data, { type: "array" });
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } else if (type === TypeScales.TmaExportFormat) {
        fileName = "Экспорт_TMA";
        const data = new Uint8Array(res);
        const workbook = XLSX.read(data, { type: "array" });
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } else {
        fileName =
          TypeScales.ThePosExportFormat === type ? "Экспорт_POS" : "Штрих-М";
        const data = new Uint8Array(res);
        const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      showErrorMessage(error);
      console.error("Download failed:", error);
    }
  };

  return (
    <Dropdown
      toggleClassName="bg-white flex items-center"
      renderTitle={
        <Button variant="solid" size="sm" type="button">
            Скачать файл для весов
        </Button>
      }
    >
      <Dropdown.Item
        onClick={() => handleDownload(TypeScales.ShtrixmExportFormat)}
      >
        Скачать файл для весов Штрих-М
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => handleDownload(TypeScales.RongtaExportFormat)}
      >
        Скачать файл для весов Rongta
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleDownload(TypeScales.TmaExportFormat)}>
        Скачать файл для весов TM-A Barcode Printing
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => handleDownload(TypeScales.ThePosExportFormat)}
      >
        Скачать файл для весов The Pos
      </Dropdown.Item>
    </Dropdown>
  );
};

export default DownloadFileForScales;

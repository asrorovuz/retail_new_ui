import { useExportProductScaleApi } from "@/entities/products/repository";
import { showErrorMessage } from "@/shared/lib/showMessage";
import { Button, Dropdown } from "@/shared/ui/kit";

enum TypeScales {
    ShtrixmExportFormat = 1, // txt
    RongtaExportFormat = 2, // excel
    TmaExportFormat = 3, // excel
    ThePosExportFormat = 4, // txt
}

const DownloadFileForScales = ({ handleExport }: any) => {
    const { mutateAsync } = useExportProductScaleApi();

    const handleDownload = async (type: TypeScales) => {
        try {
            const res = await mutateAsync({ format: type });

            let fileName = "Файл"; // default nom

            if (
                type === TypeScales.RongtaExportFormat ||
                type === TypeScales.TmaExportFormat
            ) {
                const fileName =
                    type === TypeScales.RongtaExportFormat
                        ? "Экспорт_Ронгта"
                        : "Экспорт_TMA";

                const uint8Array = new Uint8Array(res);
                const blob = new Blob([uint8Array], {
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
            } else {
                fileName =
                    TypeScales.ThePosExportFormat === type
                        ? "Экспорт_POS"
                        : "Штрих-М";
                const data = new Uint8Array(res);
                const blob = new Blob([data], {
                    type: "text/plain;charset=utf-8",
                });
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
                <Button variant="default" size="sm" type="button">
                    Импорт
                </Button>
            }
        >
            <Dropdown.Item onClick={handleExport}>
                Экспорт в Excel
            </Dropdown.Item>

            <Dropdown.Menu title={"Скачать файл для весов"}>
                <Dropdown.Item
                    onClick={() =>
                        handleDownload(TypeScales.ShtrixmExportFormat)
                    }
                >
                    Скачать файл для весов Штрих-М
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() =>
                        handleDownload(TypeScales.RongtaExportFormat)
                    }
                >
                    Скачать файл для весов Rongta
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => handleDownload(TypeScales.TmaExportFormat)}
                >
                    Скачать файл для весов TM-A Barcode Printing
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() =>
                        handleDownload(TypeScales.ThePosExportFormat)
                    }
                >
                    Скачать файл для весов The Pos
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default DownloadFileForScales;

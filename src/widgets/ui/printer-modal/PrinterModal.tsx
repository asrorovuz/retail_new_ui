import { messages } from "@/app/constants/message.request";
import { useCreatePrintApi, usePrinterApi } from "@/entities/init/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Select } from "@/shared/ui/kit";
import { useState } from "react";
type PrinterTypeProps = {
  type: "sale" | "refund";
  size: string | number;
  saleId: number | null;
  isOpen: boolean;
  handleCancelPrint: () => void;
  defaultName: string | null;
};

const PrinterModal = ({
  type,
  saleId,
  size,
  defaultName,
  isOpen,
  handleCancelPrint,
}: PrinterTypeProps) => {
  const [printerName, setPrinterName] = useState<string | null>(defaultName);
  const { data: printerData, isPending } = usePrinterApi();
  const { mutate: printCheck, isPending: printerPending } = useCreatePrintApi();

  const onPrint = (id?: number) => {
    printCheck(
      {
        path: type + `/receipt-${size || 80}`,
        payload: {
          sale_id: id ?? saleId,
          printer_name: printerName ?? "",
        },
      },
      {
        onSuccess() {
          showSuccessMessage(
            messages.uz.SUCCESS_MESSAGE,
            messages.ru.SUCCESS_MESSAGE
          );
        },
        onError(error) {
          showErrorMessage(error);
        },
      }
    );
  };

  return (
    <Dialog
      width={490}
      onClose={handleCancelPrint}
      onRequestClose={handleCancelPrint}
      isOpen={isOpen}
      title={"Распечатать"}
    >
      <div className="mb-6">
        <Select
          isClearable
          isLoading={isPending}
          options={
            printerData?.map((i) => ({
              type: i,
              value: i,
            })) || []
          }
          value={printerName ? { type: printerName, value: printerName } : null}
          getOptionLabel={(option) => option.type}
          getOptionValue={(option) => option.value}
          onChange={(option) => setPrinterName(option?.value || null)}
          placeholder={"принтер"}
          className={"border border-gray-500 rounded-xl"}
        />
      </div>
      <div className="flex justify-end gap-x-2">
        <Button onClick={handleCancelPrint}>Отменить</Button>
        <Button
          variant={"solid"}
          className={""}
          onClick={() => onPrint()}
          loading={printerPending}
        >
          Распечатать
        </Button>
      </div>
    </Dialog>
  );
};

export default PrinterModal;

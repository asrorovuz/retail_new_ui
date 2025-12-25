import classNames from "@/shared/lib/classNames";
import { Button, Dropdown } from "@/shared/ui/kit";
import { FaCheckCircle, FaClock, FaEdit, FaPrint } from "react-icons/fa";
import InfoGrid from "./InfoGrid";
import ProductTable from "./ProductTable";
import TotalsBlock from "./TotalsBlock";
import DeletedTable from "./DeletedTable";
import { useCreatePrintApi } from "@/entities/init/repository";
import { messages } from "@/app/constants/message.request";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { PrinterModal } from "@/widgets";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/app/config/axios";
import printJS from "print-js";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useNavigate } from "react-router-dom";
import { PaymentTypes } from "@/app/constants/payment.types";

const TransactionModal = ({ data, payKey, type, viewModal }: any) => {
  const navigate = useNavigate();
  const [printerStatus, setPrinterStatus] = useState({
    isOpen: false,
    size: "80",
  });

  console.log(data, "data");
  
  const { addDraftSale, draftSales, activateDraftSale } = useDraftSaleStore();
  const { addDraftRefund, draftRefunds, activateDraftRefund } =
    useDraftRefundStore();
  const { addDraftPurchase, draftPurchases, activateDraftPurchase } =
    useDraftPurchaseStore();

  const { settings } = useSettingsStore();
  const { mutate: printerMutate, isPending: printLoading } =
    useCreatePrintApi();

  const calculateTotals = (items: any[], filterDeleted = false) => {
    const filteredItems = filterDeleted
      ? items.filter((i) => !i?.is_deleted)
      : items.filter((i) => i?.is_deleted);

    return {
      quantity: filteredItems.reduce(
        (acc, cur) => acc + (cur?.quantity ?? 0),
        0
      ),
    };
  };

  // const { quantity: packagesCount } = calculateTotals(data?.items ?? [], true);
  const { quantity: deletedTotals } = calculateTotals(data?.items ?? [], false);

  const { mutateAsync: overheadTrigger, isPending: isOverheadMutating } =
    useMutation({
      mutationFn: () =>
        apiRequest<Blob>({
          url: `/api/pdf/${type}-default/${viewModal?.id}`,
          method: "POST",
          responseType: "blob", // 🔴 PDF uchun MUHIM
        }),
    });

  const showPrintModal = (size: "80" | "58") => {
    if (settings?.auto_print_receipt && settings?.printer_name) {
      onPrint(settings?.receipt_size);
    } else {
      setPrinterStatus((prev: any) => ({
        ...prev,
        isOpen: true,
        size: size,
      }));
    }
  };

  const handleCancelPrint = () => {
    setPrinterStatus((prev: any) => ({
      ...prev,
      isOpen: false,
      size: 80,
    }));
  };

  const handlePrintDefault = async () => {
    try {
      const res = await overheadTrigger(); // Blob qaytadi

      const blob = new Blob([res], {
        type: "application/pdf",
      });

      const blobUrl = window.URL.createObjectURL(blob);
      printJS(blobUrl);
    } catch (err) {
      showErrorMessage(err);
    }
  };

  const onPrint = (size: "80" | "58") => {
    const payload =
      type === "sale"
        ? {
            sale_id: viewModal?.id ?? data?.id,
            printer_name: settings?.printer_name ?? "",
          }
        : type === "purchase"
        ? {
            purchase_id: viewModal?.id ?? data?.id,
            printer_name: settings?.printer_name ?? "",
          }
        : {
            refund_id: viewModal?.id ?? data?.id,
            printer_name: settings?.printer_name ?? "",
          };
    printerMutate(
      {
        path: `${type}-receipt-${size}`,
        payload,
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

  const onSubmit = () => {
    const items = data?.items?.map((item: any) => {
      return {
        id: item?.id,
        productId: item?.warehouse_operation_from?.product?.id,
        productName: item?.warehouse_operation_from?.product?.name,
        productPackageName:
          item?.warehouse_operation_from?.product?.package_name,
        priceAmount: item?.price_amount,
        priceTypeId: item?.price_type_id,
        quantity: item?.quantity,
        totalAmount: item?.quantity * item?.price_amount,
        marks: item?.marks,
        catalogCode: item?.warehouse_operation_from?.product?.catalog_code,
        catalogName: item?.warehouse_operation_from?.product?.catalog_name,
      };
    });

    const cashBoxStates =
      type === "sale"
        ? data?.payment?.cash_box_states || []
        : data?.payout?.cash_box_states || [];

    const paymentAmounts = PaymentTypes?.map((paymentType) => {
      const founded = cashBoxStates?.find(
        (state: any) => state?.type === paymentType?.type
      );

      return {
        paymentType: paymentType.type,
        amount: founded ? founded.amount : 0,
      };
    });

    const payload = {
      id: data?.id,
      items: items,
      isActive: true,
      discountAmount: data?.exact_discounts?.[0]?.amount,
      [payKey]: {
        amounts: paymentAmounts,
      },
    };
    
    if (type === "sale") {
      if (!draftSales?.some((item) => item.id === data?.id)) {
        addDraftSale(payload);
      } else {
        const index = draftSales?.findIndex((item) => item?.id === data?.id);
        activateDraftSale(index ?? 0);
      }
      navigate("/sales");
    }

    if (type === "refund") {
      if (!draftRefunds?.some((item) => item.id === data?.id)) {
        addDraftRefund(payload);
      } else {
        const index = draftRefunds?.findIndex((item) => item?.id === data?.id);
        activateDraftRefund(index ?? 0);
      }
      navigate("/refund");
    }

    if (type === "purchase") {
      if (!draftPurchases?.some((item) => item.id === data?.id)) {
        addDraftPurchase(payload);
      } else {
        const index = draftPurchases?.findIndex(
          (item) => item?.id === data?.id
        );
        activateDraftPurchase(index ?? 0);
      }
      navigate("/purchase");
    }
  };

  return (
    <div className="h-[75vh] overflow-y-auto">
      <div className="sticky top-0 bg-white">
        <div className="flex justify-between items-center">
          <p className="flex gap-x-2">
            <span>Создано:</span>
            {data?.created_at
              ? new Date(data.created_at).toLocaleString("ru-RU")
              : "Неизвестно"}
          </p>
          <div className="flex items-center gap-x-3">
            <Dropdown
              renderTitle={
                <Button icon={<FaPrint className="size-4" />}>
                  <span className="font-medium">Распечатать</span>
                </Button>
              }
            >
              <div className="px-3 py-1 text-sm font-semibold text-gray-500 ml-1.5">
                Накладной распечатка
              </div>
              <Dropdown.Item
                disabled={isOverheadMutating}
                onClick={handlePrintDefault}
              >
                Распечатать накладную
              </Dropdown.Item>

              <div className="px-3 py-1 text-sm font-semibold text-gray-500 border-t mt-1 ml-1.5">
                Чек распечатка
              </div>

              <Dropdown.Item
                disabled={printLoading}
                onClick={() => showPrintModal("58")}
              >
                {printLoading
                  ? "Распечатать чек (58mm)..."
                  : "Распечатать чек (58mm)"}
              </Dropdown.Item>

              <Dropdown.Item
                disabled={printLoading}
                onClick={() => showPrintModal("80")}
              >
                {printLoading
                  ? "Распечатать чек (80mm)..."
                  : "Распечатать чек (80mm)"}
              </Dropdown.Item>
            </Dropdown>
            <Button onClick={onSubmit} icon={<FaEdit />} variant="solid">
              Редактировать
            </Button>
          </div>
        </div>
        <div className="mb-6">
          <span
            className={classNames(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm",
              data?.is_approved
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-amber-100 text-amber-800 border border-amber-200"
            )}
          >
            {data?.is_approved ? (
              <>
                <FaCheckCircle className="size-4" />
                Подтверждено
              </>
            ) : (
              <>
                <FaClock className="size-4" />
                Не подтверждено
              </>
            )}
          </span>
        </div>
      </div>

      <InfoGrid data={data} />

      <ProductTable
        items={data?.items?.filter((i: any) => !i?.is_deleted) ?? []}
        totals={data?.totals}
        discount={data?.exact_discounts?.[0] ?? 0}
      />
      <TotalsBlock data={data} payKey={payKey} />
      {deletedTotals > 0 && (
        <DeletedTable
          items={data.items?.filter((i: any) => i?.is_deleted) ?? []}
          deletedTotals={deletedTotals}
        />
      )}
      <PrinterModal
        type={type}
        isOpen={!!viewModal?.id && printerStatus?.isOpen}
        size={printerStatus?.size ?? "80"}
        saleId={viewModal?.id}
        defaultName={settings?.printer_name ?? null}
        handleCancelPrint={handleCancelPrint}
      />
    </div>
  );
};

export default TransactionModal;

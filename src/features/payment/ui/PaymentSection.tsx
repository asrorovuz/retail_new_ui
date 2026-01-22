import { messages } from "@/app/constants/message.request";
import { GetPaymentProviderLogo } from "@/app/constants/payme-providers";
import { usePaymentProviderApi } from "@/entities/sale/repository";
import { useDeletePaymentProvider } from "@/entities/settings/repository";
import { AddPaymentProvider, EditPaymentProvider } from "@/features/payment";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Card, Table, Tag } from "@/shared/ui/kit";
import { CommonDeleteDialog } from "@/widgets";
import { MdDelete } from "react-icons/md";

const PaymentSection = () => {
  const { data } = usePaymentProviderApi();
  const { THead, TBody, Tr, Th, Td } = Table;

  const { mutate: deletePaymentProvider } = useDeletePaymentProvider();

  const onDeleteFiscalized = (id: number) => {
    deletePaymentProvider(id, {
      onSuccess() {
        showSuccessMessage(
          messages.uz.SUCCESS_MESSAGE,
          messages.ru.SUCCESS_MESSAGE
        );
      },
      onError(error) {
        showErrorMessage(error);
      },
    });
  };

  return (
    <Card className="p-6 rounded-lg bg-white w-full select-none">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">
        Платёжные системы
      </h2>

      <div className="flex justify-end mb-3">
        <AddPaymentProvider />
      </div>

      {/* Table */}
      {data && data?.length > 0 ? (
        <Table className="w-full bg-white">
          <THead>
            <Tr className="w-full">
              <Th className="text-left">
                <span className="py-3">Тип</span>
              </Th>
              <Th className="text-left">
                <span className="py-3">Активен</span>
              </Th>
              <Th className="text-left">
                <span className="py-3">Детали</span>
              </Th>
              <Th className="text-left">
                <span className="py-3"></span>
              </Th> 
            </Tr>
          </THead>
          <TBody>
            {data?.map((provider: any) => (
              <Tr key={provider.id}>
                <Td className="py-2">
                  <div className="px-5">
                    <img
                      src={GetPaymentProviderLogo(provider.type)}
                      alt={provider.type}
                      className="w-10 h-full object-cover"
                    />
                  </div>
                </Td>
                <Td className="py-2 px-4">
                  {provider.is_enabled ? (
                    <Tag className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Активен
                    </Tag>
                  ) : (
                    <Tag className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Неактивен
                    </Tag>
                  )}
                </Td>
                <Td className="py-2 px-4 text-sm text-gray-700">
                  {provider.details || "-"}
                </Td>
                <Td>
                  <div className="flex justify-end items-center gap-x-2">
                    <EditPaymentProvider paymentProvider={provider} />
                    <CommonDeleteDialog
                      children={
                        <Button
                          className="p-0 pt-1 text-red-500 hover:text-red-600 bg-transparent"
                          variant="plain"
                        >
                          <MdDelete size={20} />
                        </Button>
                      }
                      title="Удаление поставщика платежных услуг"
                      description="Вы действительно хотите удалить поставщика платежных
                        услуг?"
                      onDelete={() => onDeleteFiscalized(provider?.id)}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="py-5 text-center text-xl">Платёжные системы не найдены</div>
      )}
    </Card>
  );
};

export default PaymentSection;

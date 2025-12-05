import { messages } from "@/app/constants/message.request";
import { useFescalDeviceApi } from "@/entities/sale/repository";
import {
  useDeleteFiscalized,
  useUpdateArca,
  useUpdateEPos,
  useUpdateHippoPos,
  useUpdateSimurg,
} from "@/entities/settings/repository";
import { AddFiscalDevice, EditFiscalDevice } from "@/features/fiscalized";
import {
  CashRegisterProviderTypeArca,
  CashRegisterProviderTypeEPos,
  CashRegisterProviderTypeHippoPos,
  CashRegisterProviderTypeSimurg,
  GetCashRegisterProviderName,
} from "@/shared/lib/cashProvider";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Switcher, Table, Tag } from "@/shared/ui/kit";
import { CommonDeleteDialog } from "@/widgets";
import { MdDelete } from "react-icons/md";

const FiscalizedPage = () => {
  const { data: getCashRegisterData } = useFescalDeviceApi(true);
  const { mutate: updateMutateArca } = useUpdateArca();
  const { mutate: updateMutateSimurg } = useUpdateSimurg();
  const { mutate: updateMutateHippoPos } = useUpdateHippoPos();
  const { mutate: updateMutateEPos } = useUpdateEPos();
  const { mutate: deleteFiscalized } = useDeleteFiscalized();

  const onDeleteFiscalized = (id: number) => {
    deleteFiscalized(id, {
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

  const handleToggle = async (item: any) => {
    if (Number(item.type) === CashRegisterProviderTypeArca) {
      updateMutateArca(
        {
          id: item.id,
          payload: {
            is_enabled: !item.is_enabled,
            name: item.name,
            address: item.info?.address,
            username: item.info?.username,
            password: item.info?.password,
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
    }

    if (Number(item.type) === CashRegisterProviderTypeHippoPos) {
      updateMutateHippoPos(
        {
          id: item.id,
          payload: {
            name: item.name,
            is_enabled: !item.is_enabled,
            company_name: item.info?.company_name,
            company_address: item.info?.company_address,
            company_inn: item.info?.company_inn,
            printer_size: Number(item.info?.printer_size),
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
    }

    if (Number(item.type) === CashRegisterProviderTypeEPos) {
      updateMutateEPos(
        {
          id: item.id,
          payload: {
            name: item.name,
            is_enabled: !item.is_enabled,
            company_name: item.info?.company_name,
            company_address: item.info?.company_address,
            company_inn: item.info?.company_inn,
            printer_size: Number(item.info?.printer_size),
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
    }

    if (Number(item.type) === CashRegisterProviderTypeSimurg) {
      updateMutateSimurg(
        {
          id: item.id,
          payload: {
            is_enabled: !item.is_enabled,
            name: item.name,
            com_port_number: Number(item.info?.com_port_number),
            cashier_password: Number(item.info?.cashier_password),
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
    }
  };

  const { TBody, Tr, Td } = Table;

  return (
    <div className="overflow-x-auto bg-white shadow rounded-3xl p-6 h-[calc(100vh-100px)]">
      <div className="flex justify-end mb-3">
        <AddFiscalDevice />
      </div>
      {/* Content */}
      {getCashRegisterData && getCashRegisterData?.length ? (
        <Table className="w-full">
          <TBody>
            <Tr className="w-full">
              <Td>
                <div className="py-2 px-5">Название</div>
              </Td>
              <Td>
                <div className="py-2 ">Тип</div>
              </Td>
              <Td>
                <div className="py-2">Активен</div>
              </Td>
              <Td>
                <div className="py-2">Детали</div>
              </Td>
              <Td>
                <div className="py-2">Состояние</div>
              </Td>
              <Td>
                <div className="py-2"></div>
              </Td>
            </Tr>
            {getCashRegisterData.map((item: any) => (
              <Tr className="w-full text-gray-800" key={item.id}>
                <Td>
                  <span className="px-5">{item.name}</span>
                </Td>
                <Td className="py-3 px-4 font-bold">
                  {GetCashRegisterProviderName(item.type)}
                </Td>
                <Td>
                  <div className="">
                    {item.is_enabled ? (
                      <Tag className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Активен
                      </Tag>
                    ) : (
                      <Tag className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Неактивен
                      </Tag>
                    )}
                  </div>
                </Td>

                <Td>{CashRegisterType(item) || "-"}</Td>
                <Td>
                  <Switcher
                    checked={item.is_enabled}
                    onChange={() => handleToggle(item)}
                  />
                </Td>

                <Td className="flex justify-end items-center gap-x-5">
                  <EditFiscalDevice getCashRegisterData={item} />
                  <CommonDeleteDialog
                    children={
                      <Button
                        className="p-0 pt-1 text-red-500 hover:text-red-600 bg-transparent"
                        variant="plain"
                      >
                        <MdDelete size={20} />
                      </Button>
                    }
                    title="Удаление терминала"
                    description="Вы действительно хотите удалить терминал?"
                    onDelete={() => onDeleteFiscalized(item?.id)}
                  />
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="bg-white py-5 text-center text-xl">
          Вы еще не добавили ни одного терминала
        </div>
      )}
    </div>
  );
};

export default FiscalizedPage;

const CashRegisterType = (item: any) => {
  if (item?.type === CashRegisterProviderTypeHippoPos) {
    return (
      <ul className="list-disc list-inside text-[14px] font-medium marker:text-blue-500">
        <li>
          Адрес компании:{" "}
          <span className="font-semibold">{item?.info?.company_address}</span>
        </li>
        <li>
          Название компании:{" "}
          <span className="font-semibold">{item?.info?.company_name}</span>
        </li>
        <li>
          ИНН: <span className="font-semibold">{item?.info?.company_inn}</span>
        </li>
      </ul>
    );
  }

  if (item?.type === CashRegisterProviderTypeArca) {
    return (
      <ul className="list-disc list-inside text-[14px] font-medium marker:text-green-500">
        <li>
          Адрес: <span className="font-semibold">{item?.info?.address}</span>
        </li>
        <li>
          Логин: <span className="font-semibold">{item?.info?.username}</span>
        </li>
      </ul>
    );
  }

  if (item?.type === CashRegisterProviderTypeSimurg) {
    return (
      <>-</>
      //   <ul className="list-disc list-inside text-[14px] font-medium marker:text-purple-500">
      //     <li>Simurg qo‘llab-quvvatlanadi</li>
      //   </ul>
    );
  }

  if (item?.type === CashRegisterProviderTypeEPos) {
    return (
      <ul className="list-disc list-inside text-[14px] font-medium marker:text-red-500">
        <ul className="list-disc list-inside text-[14px] font-medium marker:text-blue-500">
          <li>
            Адрес компании:{" "}
            <span className="font-semibold">{item?.info?.company_address}</span>
          </li>
          <li>
            Название компании:{" "}
            <span className="font-semibold">{item?.info?.company_name}</span>
          </li>
          <li>
            ИНН:{" "}
            <span className="font-semibold">{item?.info?.company_inn}</span>
          </li>
        </ul>
      </ul>
    );
  }

  return null;
};

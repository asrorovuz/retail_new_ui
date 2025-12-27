import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Controller, useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { useEffect, useState } from "react";
import {
  useAddContacts,
  useDeleteTelegramBot,
  useSendContacts,
} from "@/entities/settings/repository";
import {
  showErrorLocalMessage,
  showErrorMessage,
  showSuccessMessage,
} from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import { Button, Card, Dialog, Form, FormItem, Input } from "@/shared/ui/kit";
import dayjs from "dayjs";
import { CommonDeleteDialog } from "@/widgets";

const Report = ({ item, telegramBotConfig }: any) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: { token: "", name: "", type: 1 },
  });
  const [openModalDialog, setOpenModalDialog] = useState(false);
  const [numberData, setNumberData] = useState<string[]>([""]);
  const [showToken, setShowToken] = useState(false);
  const [error, setErrorState] = useState<boolean>(false);

  const { mutate: deleteTelegramBot, isPending: deleteTelegramBotLoading } =
    useDeleteTelegramBot();
  const { mutate: sendContacts, isPending: sendContactsPending } =
    useSendContacts();
  const { mutate: addContacts, isPending: addContactsPending } =
    useAddContacts();

  useEffect(() => {
    if (item) setValue("token", item.token);
  }, [item]);

  const onOpenModalDialog = () => {
    setOpenModalDialog(true);
    const contacts = telegramBotConfig
      ?.find((i: any) => i.bot_type === item?.type)
      ?.info_data?.admin_contacts.map((num: string) => {
        if (num.length === 12 && num.startsWith("998")) {
          return num.slice(3);
        }
        return num;
      }) || [""];
    setNumberData(contacts);
  };

  const onCloseModalDialog = () => {
    setOpenModalDialog(false);
    setNumberData([""]);
  };

  const onSubmitNumiberData = async () => {
    const invalidIndex = numberData.findIndex((num) => {
      const digits = num.replace(/\D/g, "");
      return digits.length !== 9;
    });

    if (invalidIndex !== -1) {
      setErrorState(true);
      showErrorLocalMessage(`Неверный номер в строке ${invalidIndex + 1}`);
      return;
    }

    const payload = {
      type: item?.type || 1,
      contacts: numberData
        .filter((num) => num.trim() !== "")
        .map((num) => {
          const cleaned = num.replace(/\D/g, "");
          return "998" + cleaned;
        }),
    };
    setErrorState(false);
    sendContacts(payload, {
      onSuccess() {
        showSuccessMessage(
          messages.uz.SUCCESS_MESSAGE,
          messages.ru.SUCCESS_MESSAGE
        );
        onCloseModalDialog();
      },
      onError(err) {
        showErrorMessage(err);
      },
    });
  };

  const onSubmit = async (values: any) => {
    addContacts(values, {
      onSuccess() {
        reset();
      },
      onError(err) {
        showErrorMessage(err);
      },
    });
  };

  const handleDeleteTelegramBot = () => {
    deleteTelegramBot(item?.id, {
      onSuccess() {
        reset({ token: "", name: "", type: 1 });
      },
      onError(err) {
        showErrorMessage(err);
      },
    });
  };

  return (
    <>
      <Card
        className="mt-5 pb-5"
        header={{
          content: "Отчет",
          extra: (
            <p>
              {item?.created_at
                ? dayjs(item?.created_at).format("DD-MM-YYYY")
                : null}
            </p>
          ),
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800 my-6">
          Телеграм боты
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="token"
            control={control}
            render={({ field }) => (
              <FormItem
                className="mt-1"
                label={"Токен бота Telegram"}
                asterisk={true}
              >
                <div className="relative">
                  <Input
                    {...field}
                    type={showToken ? "text" : "password"}
                    placeholder={"Токен бота Telegram"}
                    className="pr-10"
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData("text");
                      field.onChange(pastedText);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </FormItem>
            )}
          />
          <a
            className="text-[16px] underline underline-offset-2"
            href={`https://t.me/${item?.username}`}
            target="_blank"
          >
            {item?.username}
          </a>
          <div className="flex justify-end gap-x-2 mt-5">
            {item?.token ? (
              <>
                <CommonDeleteDialog
                  children={
                    <Button
                      type="button"
                      className="text-red-500 border-red-500 "
                    >
                      Удалить
                    </Button>
                  }
                  loading={deleteTelegramBotLoading}
                  title="Удалить телеграм бот"
                  description="Вы уверены, что хотите продолжить?"
                  onDelete={handleDeleteTelegramBot}
                />
                <Button
                  onClick={onOpenModalDialog}
                  type="button"
                  variant="solid"
                  className="bg-blue-700 hover:bg-blue-700 hover:opacity-85 text-white hover:text-white hover:border-0"
                >
                  Настройки
                </Button>
              </>
            ) : (
              <Button
                loading={addContactsPending}
                type="submit"
                variant="solid"
              >
                Сохранить
              </Button>
            )}
          </div>

          <div>
            <ul>{}</ul>
          </div>
        </Form>
      </Card>

      <Dialog
        title={"Настройки бота"}
        width={490}
        isOpen={openModalDialog}
        onClose={() => onCloseModalDialog()}
      >
        <p className="mb-2">Телефоны администраторов бота</p>
        {numberData?.map((phone, index) => (
          <>
            <div key={index} className="flex gap-2 mb-2">
              <PatternFormat
                className={`w-full border rounded-md p-2 ${
                  error && phone.length !== 9
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                format="+998 (##) ###-##-##"
                allowEmptyFormatting
                mask="_"
                value={phone}
                onValueChange={(values) => {
                  const onlyDigits = values.value;
                  const updated = [...numberData];
                  updated[index] = onlyDigits;
                  setNumberData(updated);
                }}
              />

              <Button
                type="button"
                variant="solid"
                size="sm"
                className="bg-red-500 rounded-lg hover:bg-red-400 text-white transition-all duration-300"
                onClick={() => {
                  const updated = [...numberData];
                  updated.splice(index, 1);
                  setNumberData(updated);
                }}
              >
                <RiDeleteBinLine />
              </Button>
            </div>
            {error && phone.length !== 9 && (
              <p className="w-full block text-red-500 text-sm mb-3">
                Неверный номер телефона
              </p>
            )}
          </>
        ))}
        <Button
          onClick={() => setNumberData([...numberData, ""])}
          type="button"
          size="sm"
        >
          + Добавить
        </Button>

        <Button
          variant="solid"
          loading={sendContactsPending}
          className="mt-4 w-full bg-blue-700 hover:bg-blue-600 text-white"
          onClick={onSubmitNumiberData}
        >
          Сохранить
        </Button>
      </Dialog>
    </>
  );
};

export default Report;

import {
  useAllBotApi,
  useAllBotConfigApi,
} from "@/entities/settings/repository";
import {} from "react";
import Report from "./Report";

const TelegramBot = () => {
  const { data: telegramBot } = useAllBotApi();
  const { data: telegramBotConfig } = useAllBotConfigApi();

  return (
    <Report
      telegramBotConfig={telegramBotConfig}
      item={telegramBot?.find((i: any) => i.type === 1)!}
    />
  );
};

export default TelegramBot;

import classNames from "@/shared/lib/classNames";
import { Button, Dialog } from "@/shared/ui/kit";
import { FaCheckCircle } from "react-icons/fa";

const StatusBar = ({ openStatusBar, handleCloseBar, status }: any) => {
  const pct =
    status?.totalData > 0
      ? Math.min(100, (status?.total / status?.totalData) * 100)
      : 0;
  return (
    <Dialog
      width={"100%"}
      closable={false}
      className={"px-20 py-20"}
      isOpen={openStatusBar}
    >
      {!status?.status ? (
        <h2 className="flex items-center justify-center gap-x-2 mt-10 mb-10">
          <span className="text-green-500">
            <FaCheckCircle />
          </span>{" "}
          Завершено
        </h2>
      ) : (
        ""
      )}
      <div className="mb-10">
        <div
          className="w-full mb-2 rounded-lg bg-slate-200 shadow-inner overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={classNames(
              "flex items-center justify-center text-white font-semibold text-xs sm:text-sm select-none",
              "h-6 transition-[width] duration-500 ease-in-out",
              // 🔹 oddiy gradient + background-size
              "bg-[linear-gradient(45deg,#3b82f6_25%,#2563eb_25%,#2563eb_50%,#3b82f6_50%,#3b82f6_75%,#2563eb_75%,#2563eb_100%)]",
              "bg-[length:40px_40px]",
              // 🔹 harakatli animatsiya
              "animate-stripes"
            )}
            style={{ width: `${pct}%` }}
          ></div>
        </div>
        {status?.totalData && (
          <div className="text-center text-blue-500 font-semibold">
            {pct.toFixed(2)} %
          </div>
        )}
      </div>

      <div className="flex items-center justify-around gap-x-5 mb-10">
        <div className="flex flex-col items-center text-green-600 font-semibold text-[16px]">
          <p className="text-[20px]">{status?.success}</p>
          <p>(Успешно загруженных)</p>
        </div>
        <div className="text-[28px] text-gray-700">
          {status?.success + status?.faild} из {status?.totalData}
        </div>
        <div className="flex flex-col items-center text-red-600 font-semibold text-[16px]">
          <p className="text-[20px]">{status?.faild}</p>
          <p>(Неудавшихся загрузить)</p>
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <Button
          disabled={status?.status}
          onClick={handleCloseBar}
          variant="solid"
          size="sm"
        >
          Нажмите, чтобы продолжить
        </Button>
      </div>
    </Dialog>
  );
};

export default StatusBar;

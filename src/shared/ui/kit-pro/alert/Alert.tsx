import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiInformationCircle,
  HiExclamation,
  HiXCircle,
} from "react-icons/hi";
import { useState } from "react";

type AlertType = "success" | "danger" | "warning" | "info";

interface AlertProps {
  type?: AlertType;
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const TYPE_MAP = {
  success: {
    icon: <HiCheckCircle className="text-green-600 text-3xl" />,
    border: "border-green-500",
    bg: "bg-green-50",
    title: "text-green-700",
  },
  danger: {
    icon: <HiXCircle className="text-red-600 text-3xl" />,
    border: "border-red-500",
    bg: "bg-red-50",
    title: "text-red-700",
  },
  warning: {
    icon: <HiExclamation className="text-yellow-500 text-3xl" />,
    border: "border-yellow-500",
    bg: "bg-yellow-50",
    title: "text-yellow-700",
  },
  info: {
    icon: <HiInformationCircle className="text-blue-600 text-3xl" />,
    border: "border-blue-500",
    bg: "bg-blue-50",
    title: "text-blue-700",
  },
};

const Alert = ({
  type = "info",
  title = "Вы уверены?",
  content = "Это действие нельзя будет отменить.",
  onConfirm,
  onCancel,
}: AlertProps) => {
  const [visible, setVisible] = useState(true);
  const style = TYPE_MAP[type];

  const handleCancel = () => {
    setVisible(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 flex pt-20 justify-center bg-black/40 z-50`}
    >
      <div
        className={`w-[400px] h-max rounded-xl border ${style.border} ${style.bg} p-5 shadow-xl`}
      >
        <div className="flex items-center gap-3 mb-3">
          {style.icon}
          <h2 className={`text-xl font-semibold ${style.title}`}>{title}</h2>
        </div>
        <p className="text-gray-700 mb-5">{content}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : type === "success"
                ? "bg-green-600 hover:bg-green-700"
                : type === "warning"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Alert;

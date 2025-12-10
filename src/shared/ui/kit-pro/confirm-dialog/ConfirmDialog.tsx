import {
  HiCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineExclamation,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import type { ReactNode } from "react";
import { Dialog, type DialogProps } from "../../kit/Dialog";
import { Button, type ButtonProps } from "../../kit/Button";
type StatusType = "info" | "success" | "warning" | "danger";

interface ConfirmDialogProps extends DialogProps {
  cancelText?: ReactNode | string;
  confirmText?: ReactNode | string;
  confirmButton?: ReactNode;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  type?: StatusType;
  title?: ReactNode | string;
  onCancel?: () => void;
  onConfirm?: () => void;
  description?: string;
}

/* -------- STATUS ICON -------- */
const StatusIcon = ({ status }: { status: StatusType }) => {
  const baseStyle =
    "w-12 h-12 flex items-center justify-center rounded-full shadow-sm";

  switch (status) {
    case "info":
      return (
        <div className={`${baseStyle} bg-blue-100 text-blue-600`}>
          <HiOutlineInformationCircle className="text-3xl" />
        </div>
      );
    case "success":
      return (
        <div className={`${baseStyle} bg-emerald-100 text-emerald-600`}>
          <HiCheckCircle className="text-3xl" />
        </div>
      );
    case "warning":
      return (
        <div className={`${baseStyle} bg-amber-100 text-amber-600`}>
          <HiOutlineExclamationCircle className="text-3xl" />
        </div>
      );
    case "danger":
      return (
        <div className={`${baseStyle} bg-red-100 text-red-600`}>
          <HiOutlineExclamation className="text-3xl" />
        </div>
      );
    default:
      return null;
  }
};

/* -------- CONFIRM DIALOG -------- */
const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    type = "info",
    title,
    description,
    children,
    onCancel,
    onConfirm,
    cancelText = "Cancel",
    confirmText = "Confirm",
    confirmButton,
    confirmButtonProps,
    cancelButtonProps,
    ...rest
  } = props;

  return (
    <Dialog title={title} contentClassName="pb-0 px-0 rounded-2xl overflow-hidden" {...rest}>
      <div className="flex items-start gap-4 mb-5">
        <StatusIcon status={type} />
        <div className="flex-1">
          {/* <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4> */}
          {description && (
            <p className="text-[16px] text-gray-600 leading-snug">{description}</p>
          )}
          {children && <div className="mt-3 text-sm text-gray-700">{children}</div>}
        </div>
      </div>

      <div className="px-2 w-full flex justify-end gap-2">
        <Button
          size="md"
          onClick={onCancel}
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
        {confirmButton ? (
          confirmButton
        ) : (
          <Button
            size="md"
            variant={
              type === "danger"
                ? "solid"
                : type === "warning"
                ? "solid"
                : "solid"
            }
            className={`${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : type === "warning"
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={onConfirm}
            {...confirmButtonProps}
          >
            {confirmText}
          </Button>
        )}
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;

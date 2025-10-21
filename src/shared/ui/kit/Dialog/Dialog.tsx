import Modal from "react-modal";
import classNames from "classnames";
import CloseButton from "../CloseButton";
import { motion } from "framer-motion";
import useWindowSize from "../hooks/useWindowSize";
import type ReactModal from "react-modal";
import type { MouseEvent, ReactNode } from "react";

export interface DialogProps extends ReactModal.Props {
  closable?: boolean;
  contentClassName?: string;
  height?: string | number;
  onClose?: (e: MouseEvent<HTMLSpanElement>) => void;
  width?: number | string;
  title?: ReactNode; // 🆕 title prop qo‘shildi
}

const Dialog = (props: DialogProps) => {
  const currentSize = useWindowSize();
  const {
    bodyOpenClassName,
    children,
    className,
    closable = true,
    closeTimeoutMS = 150,
    contentClassName,
    height,
    isOpen,
    onClose,
    overlayClassName,
    portalClassName,
    style,
    width,
    title,
    ...rest
  } = props;

  const onCloseClick = (e: MouseEvent<HTMLSpanElement>) => {
    onClose?.(e);
  };

  const renderCloseButton = (
    <CloseButton className="!bg-transparent !text-2xl hover:!text-gray-600 !active:scale-110" onClick={onCloseClick} />
  );

  const contentStyle = {
    content: {
      inset: "unset",
    },
    ...style,
  };

  if (width !== undefined) {
    contentStyle.content.width = width;
    if (typeof width === "string") {
      contentStyle.content.width = width;
    } else if (
      typeof currentSize.width !== "undefined" &&
      currentSize.width <= width
    ) {
      contentStyle.content.width = "auto";
    }
  }

  if (height !== undefined) {
    contentStyle.content.height = height;
  }

  const defaultDialogContentClass = "dialog-content";
  const dialogClass = classNames(defaultDialogContentClass, contentClassName);

  return (
    <Modal
      className={{
        base: classNames("dialog", "rounded-3xl", className as string),
        afterOpen: "dialog-after-open",
        beforeClose: "dialog-before-close",
      }}
      overlayClassName={{
        base: classNames("dialog-overlay", overlayClassName as string),
        afterOpen: "dialog-overlay-after-open",
        beforeClose: "dialog-overlay-before-close",
      }}
      portalClassName={classNames("dialog-portal", portalClassName)}
      bodyOpenClassName={classNames("dialog-open", bodyOpenClassName)}
      ariaHideApp={false}
      isOpen={isOpen}
      style={{ ...contentStyle }}
      closeTimeoutMS={closeTimeoutMS}
      {...rest}
    >
      <motion.div
        className={dialogClass}
        initial={{ transform: "scale(0.9)" }}
        animate={{
          transform: isOpen ? "scale(1)" : "scale(0.9)",
        }}
      >
        {/* Header (title + close) */}
        {(title || closable) && (
          <div className={`flex items-start ${title ? "justify-between mb-4" : "justify-end"} pb-2 relative`}>
            {title && (
              <h2 className="text-xl font-semibold text-gray-800 m-0">
                {title}
              </h2>
            )}
            {closable && renderCloseButton}
          </div>
        )}

        {/* Content */}
        <div className="dialog-body">{children}</div>
      </motion.div>
    </Modal>
  );
};

Dialog.displayName = "Dialog";

export default Dialog;

import isReactElement from "@/shared/lib/isReactElement";
import { Button, Dialog } from "@/shared/ui/kit";
import type { CommonProps } from "@/shared/ui/kit/@types/common";
import { cloneElement, useState, type ReactElement } from "react";

interface CommonDeleteDialogType extends CommonProps {
  title?: string;
  description?: string;
  cancelButtonTitle?: string;
  deleteButtonTitle?: string;
  onDelete: () => void;
  children?: ReactElement;
  loading?: boolean;
}

export const CommonDeleteDialog = (props: CommonDeleteDialogType) => {
  const [show, setShow] = useState(false);
  const {
    children,
    title,
    description,
    deleteButtonTitle,
    cancelButtonTitle,
    onDelete,
    loading
  } = props;

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const deleteHandler = () => {
    onDelete();
    handleClose();
  };

  return (
    <div>
      {isReactElement(children) ? (
        cloneElement(children as ReactElement<{ onClick?: () => void }>, {
          onClick: handleShow,
        })
      ) : (
        <Button onClick={handleShow}>Open dialog!</Button>
      )}

      <Dialog
        isOpen={show}
        onClose={handleClose}
        title={title ?? "Внимание"}
        width={624}
        onRequestClose={handleClose}
      >
        <div className={"grid gap-7 px-1"}>
          <div>
            <span className={"h6 text-gray-600"}>{description}</span>
          </div>

          <div className={"flex justify-end items-center gap-2"}>
            <Button
              onClick={handleClose}
            >
              {cancelButtonTitle ? cancelButtonTitle : "Назад"}
            </Button>

            <Button
              variant={"solid"}
              loading={loading}
              className={
                "bg-red-700 text-white hover:bg-red-700 hover:opacity-90"
              }
              onClick={deleteHandler}
            >
              {deleteButtonTitle ? deleteButtonTitle : "Удалить"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};


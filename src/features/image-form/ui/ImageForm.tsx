import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import cloneDeep from "lodash/cloneDeep";
import { PiImagesThin } from "react-icons/pi";
import { HiEye, HiTrash } from "react-icons/hi";
import { Upload, Dialog } from "@/shared/ui/kit";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";

type ImageFormProps = {
  fieldName: string;
  control: Control<any>; // tashqaridan beriladi
  imgId?: string | number | null;
};

type Image = {
  id?: string | number | null;
  name: string;
  img: string;
  file?: File;
  fs_url?: string;
};

// 🔹 Ichki rasm ro‘yxati
const ImageList = ({
  imgList,
  onImageDelete,
}: {
  imgList: Image[];
  onImageDelete: (img: Image) => void;
}) => {
  const [selectedImg, setSelectedImg] = useState<Image>({} as Image);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const onViewOpen = (img: Image) => {
    setSelectedImg(img);
    setViewOpen(true);
  };

  const onDialogClose = () => {
    setViewOpen(false);
    setTimeout(() => setSelectedImg({} as Image), 300);
  };

  const onDeleteConfirmation = (img: Image) => {
    setSelectedImg(img);
    setDeleteConfirmationOpen(true);
  };

  const onDeleteConfirmationClose = () => {
    setSelectedImg({} as Image);
    setDeleteConfirmationOpen(false);
  };

  const onDelete = () => {
    onImageDelete?.(selectedImg);
    setDeleteConfirmationOpen(false);
  };

  return (
    <>
      {imgList.map((img) => (
        <div
          key={img.id || img.name}
          className="group h-[100px] relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
        >
          <img
            className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
            src={img.img}
            alt={img.name}
          />
          <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
            <span
              className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
              onClick={() => onViewOpen(img)}
            >
              <HiEye />
            </span>
            <span
              className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
              onClick={() => onDeleteConfirmation(img)}
            >
              <HiTrash />
            </span>
          </div>
        </div>
      ))}

      <Dialog isOpen={viewOpen} onClose={onDialogClose}>
        <h5 className="mb-4">{selectedImg.name}</h5>
        <img className="w-full" src={selectedImg.img} alt={selectedImg.name} />
      </Dialog>

      <ConfirmDialog
        width={609}
        isOpen={deleteConfirmationOpen}
        type="danger"
        title="Rasmni o‘chirish"
        onClose={onDeleteConfirmationClose}
        onCancel={onDeleteConfirmationClose}
        onConfirm={onDelete}
      >
        <p>Вы действительно хотите удалить это изображение?</p>
      </ConfirmDialog>
    </>
  );
};

// 🔹 Asosiy komponent (useFormContext yo‘q)
const ImageForm = ({ fieldName, control, imgId = null }: ImageFormProps) => {
  const beforeUpload = (file: FileList | null) => {
    let valid: boolean | string = true;
    const allowedFileType = ["image/jpeg", "image/png", "image/avif"];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    if (file) {
      for (const f of file) {
        if (!allowedFileType.includes(f.type)) {
          valid = "Please upload a .jpeg or .png file!";
        }
        if (f.size >= maxFileSize) {
          valid = "Upload image cannot be more than 500kb!";
        }
      }
    }
    return valid;
  };

  const handleUpload = (
    onChange: (images: Image[]) => void,
    originalImageList: Image[] = [],
    files: File[]
  ) => {
    const latestFile = files[0];
    const image: Image = {
      id: imgId,
      name: latestFile.name,
      img: URL.createObjectURL(latestFile),
      file: latestFile,
      fs_url: originalImageList[0]?.fs_url ?? originalImageList[0]?.img,
    };
    onChange([image]);
  };

  const handleImageDelete = (
    onChange: (images: Image[]) => void,
    originalImageList: Image[] = [],
    deletedImg: Image
  ) => {
    const imgList = cloneDeep(originalImageList).filter(
      (img) => img.id !== deletedImg.id && img.name !== deletedImg.name
    );
    onChange(imgList);
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => {
        const images: Image[] = (field.value || []).filter(
          (img: any) => img && img.img
        );

        return (
          <>
            {images.length > 0 ? (
              <div className="h-[100px] w-[100px]">
                <ImageList
                  imgList={images}
                  onImageDelete={(img) =>
                    handleImageDelete(field.onChange, images, img)
                  }
                />
              </div>
            ) : (
              <Upload
                draggable
                beforeUpload={beforeUpload}
                className="w-[110px]"
                showList={false}
                onChange={(files) =>
                  handleUpload(field.onChange, images, files)
                }
              >
                <div className="flex flex-col px-4 py-8 justify-center items-center h-[100px] w-[100px]">
                  <div className="text-[60px]">
                    <PiImagesThin />
                  </div>
                </div>
              </Upload>
            )}
          </>
        );
      }}
    />
  );
};

export default ImageForm;

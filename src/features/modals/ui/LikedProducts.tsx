import { messages } from "@/app/constants/message.request";
import {
  useAddFavouriteProduct,
  useAllProductApi,
} from "@/entities/products/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Input, Select } from "@/shared/ui/kit";
import { useMemo, useState } from "react";

const LikedProducts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isSearch, setIsSearch] = useState("");
  const [product, setProduct] = useState<{
    product_id: number | null;
    product_package_id: number | null;
  }>({
    product_id: null,
    product_package_id: null,
  });
  const [packageName, setPackageName] = useState<null | string>(null);

  const { data, isPending } = useAllProductApi(60, 1, isSearch);
  const { mutate: addFavouriteProduct, isPending: addFavouritePending } =
    useAddFavouriteProduct();

  const optionProduct = useMemo(() => {
    return data?.map((item) => ({
      label: item?.name,
      value: item?.id,
      item: item,
    }));
  }, [data]);

  const handleClose = () => {
    setProduct({
      product_id: null,
      product_package_id: null,
    });
    setOpenModal(false);
    setIsSearch("");
    setPackageName(null);
  };

  const onChangeValue = (item: any) => {
    const packName = item?.product_packages?.[0]?.measurement_name;
    setProduct({
      product_id: item?.id,
      product_package_id: item?.product_packages?.[0]?.id,
    });
    setPackageName(packName);
  };

  const onSubmit = () => {
    if (product?.product_id)
      addFavouriteProduct(product, {
        onSuccess() {
          showSuccessMessage(
            messages.uz.SUCCESS_MESSAGE,
            messages.ru.SUCCESS_MESSAGE
          );
          handleClose();
        },
        onError(error) {
          showErrorMessage(error)
        },
      });
  };

  return (
    <div>
      <Button onClick={() => setOpenModal(true)} variant="solid">
        Добавить любимые товар
      </Button>

      <Dialog
        onClose={handleClose}
        width={490}
        title={"Добавить любимые товар"}
        isOpen={openModal}
      >
        <div className="mb-5">
          <div className="mb-3">
            <Select
              isSearchable={true}
              isLoading={isPending}
              isClearable={true}
              placeholder="Выберите товар из списка"
              onChange={(ren) => onChangeValue(ren?.item)}
              options={optionProduct || []}
            />
          </div>
          <div>
            <Input
              disabled={true}
              value={packageName}
              placeholder="Единица измерения (автоматически)"
            />
          </div>
        </div>
        <div className="flex justify-end gap-x-2">
          <Button onClick={handleClose} variant="plain">
            Отменить
          </Button>
          <Button
            onClick={onSubmit}
            loading={addFavouritePending}
            variant="solid"
          >
            Сохранить
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default LikedProducts;

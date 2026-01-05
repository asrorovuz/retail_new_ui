import { messages } from "@/app/constants/message.request";
import {
  useAddFavouriteProduct,
  useAllFavoritProductApi,
  useAllProductApi,
} from "@/entities/products/repository";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Input, Select } from "@/shared/ui/kit";
import { useMemo, useState } from "react";

const LikedProducts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isSearch, setIsSearch] = useState("");
  const [product, setProduct] = useState<{
    product_id: number | null;
  }>({
    product_id: null,
  });
  const [packageName, setPackageName] = useState<number | null>(null);

  const { data, isPending } = useAllProductApi(60, 1, isSearch);
  const { data: favoriteData } = useAllFavoritProductApi();
  const { mutate: addFavouriteProduct, isPending: addFavouritePending } =
    useAddFavouriteProduct();

  const filterdata = useMemo(() => {
    const favoriteIds = favoriteData?.map((item) => item?.product?.id) || [];
    return data?.filter((item) => !favoriteIds.includes(item.id));
  }, [data, favoriteData]);

  const optionProduct = useMemo(() => {
    return filterdata?.map((item) => ({
      label: item?.name,
      value: item?.id,
      item: item,
    }));
  }, [filterdata]);

  const handleClose = () => {
    setProduct({
      product_id: null
    });
    setOpenModal(false);
    setIsSearch("");
    setPackageName(null);
  };

  const onChangeValue = (item: any) => {
    
    const packName = item?.measurement_code;
    setProduct({
      product_id: item?.id,
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
          showErrorMessage(error);
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
              value={showMeasurmentName(packageName || 0)}
              placeholder="Единица измерения (автоматически)"
            />
          </div>
        </div>
        <div className="flex justify-end gap-x-2">
          <Button onClick={handleClose}>
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

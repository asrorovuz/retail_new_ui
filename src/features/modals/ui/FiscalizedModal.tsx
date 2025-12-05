import { GetFiscalizedProviderLogo } from "@/app/constants/fiscalized.constants";
import type { FizcalResponsetype } from "@/entities/sale/model";
import { Button, Checkbox, Dialog } from "@/shared/ui/kit";
type ModalProps = {
  isOpen: boolean;
  saleId: number | null;
  selectFiscalized: FizcalResponsetype | null;
  fiscalPending: boolean;
  filterData: FizcalResponsetype[] | null;
  handleCancel: () => void;
  setSelectFiscalized: (val: FizcalResponsetype | null) => void;
  setIsOpen: (open: boolean) => void;
  handleApproveFiscalization: () => void;
};

const FiscalizedModal = ({
  isOpen,
  selectFiscalized,
  fiscalPending,
  filterData,
  setSelectFiscalized,
  handleCancel,
  handleApproveFiscalization,
}: ModalProps) => {
  return (
    <Dialog
      onClose={handleCancel}
      onRequestClose={handleCancel}
      shouldCloseOnOverlayClick={false} // ❗ tashqariga bosilganda yopilmaydi
      shouldCloseOnEsc={false} // ❗ ESC bosilganda yopilmaydi.
      width={490}
      isOpen={isOpen}
      title={"Отправить продажу в налоговую?"}
    >
      <div className="bg-gray-100 rounded-2xl p-3 mb-6 flex flex-col gap-y-4">
        {filterData?.length ? (
          filterData?.map((item) => {
            const isSelected =
              selectFiscalized && selectFiscalized?.id === item?.id;
            return (
              <div
                key={item?.id}
                className="bg-white w-full flex justify-between items-center rounded-lg py-4 px-6"
              >
                <div className="flex items-center gap-x-2">
                  {GetFiscalizedProviderLogo(Number(item?.type)) && (
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        className="w-full h-full"
                        src={GetFiscalizedProviderLogo(Number(item?.type))}
                        alt={item?.name}
                      />
                    </div>
                  )}
                  <span className="text-gray-800 font-medium">
                    {item?.name}
                  </span>
                </div>
                <Checkbox
                  checked={!!isSelected}
                  onChange={() => {
                    if (selectFiscalized?.id === item?.id) {
                      setSelectFiscalized(null);
                    } else {
                      setSelectFiscalized(item);
                    }
                  }}
                />
              </div>
            );
          })
        ) : (
          <div className="mt-4">
            <span className="text-gray-500">Нет доступных POS-терминалов</span>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-x-2">
        <Button onClick={handleCancel}>Нет</Button>
        <Button
          loading={fiscalPending}
          onClick={handleApproveFiscalization}
          variant="solid"
        >
          Да
        </Button>
      </div>
    </Dialog>
  );
};

export default FiscalizedModal;

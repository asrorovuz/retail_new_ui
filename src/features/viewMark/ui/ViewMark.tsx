import type { DraftSaleSchema } from "@/@types/sale";
import { Button, Dialog } from "@/shared/ui/kit";
import type { FC } from "react";

interface IProps {
  itemId: number;
  activeDraft: DraftSaleSchema;
  onClose: () => void;
}

const ViewMark: FC<IProps> = (props) => {
  const { itemId, activeDraft, onClose } = props;

  console.log(activeDraft);
  

  return (
    <Dialog width={720} title={"Посмотреть маркировка"} isOpen={!!itemId} onClose={onClose}>
      <div className="flex gap-y-3 flex-col">
        {activeDraft.items
          .find((i) => i.productId === itemId)
          ?.marks?.map((m, index) =>
            m ? (
              <div key={m} className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold">{index + 1}:</span>
                  &nbsp;
                  <p className="break-words whitespace-normal">
                    {m}
                    {m}
                  </p>
                </div>
              </div>
            ) : null
          )}
      </div>
      <div className="text-right mt-6">
        <Button variant="solid" onClick={onClose}>
          Закрыть
        </Button>
      </div>
    </Dialog>
  );
};

export default ViewMark;

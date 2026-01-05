import type { DraftSaleSchema } from "@/@types/sale";
import { Button, Dialog } from "@/shared/ui/kit";
import type { FC } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface IProps {
  item: number;
  activeDraft: DraftSaleSchema;
  onClose: () => void;
  deleteDraftMark: (item: { productId: number; index: number }) => void;
}

const ViewMark: FC<IProps> = (props) => {
  const { item, activeDraft, onClose, deleteDraftMark } = props;

  return (
    <Dialog width={720} title={"Посмотреть маркировка"} isOpen={!!item} onClose={onClose}>
      <div className="flex gap-y-3 flex-col">
        {activeDraft.items
          .find((i) => i.productId === item)
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
                <Button
                  size="xs"
                  icon={<FaRegTrashAlt />}
                  onClick={() =>
                    deleteDraftMark({
                      index,
                      productId: item,
                    })
                  }
                  className="bg-red-700 hover:bg-red-700 hover:opacity-85 text-white shrink-0"
                />
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

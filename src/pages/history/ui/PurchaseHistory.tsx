import {
  useOperationCountApi,
  usePurchaseApi,
  usePurchaseIdApi,
} from "@/entities/history/repository";
import { Filter, TransactionModal } from "@/features/history";
import TableHistory from "@/features/history/ui/Table";
import { Button, Dialog } from "@/shared/ui/kit";
import Loading from "@/shared/ui/loading";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [params, setParams] = useState({
    skip: 0,
    limit: 10,
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    id: null,
  });

  const { data, isLoading } = usePurchaseApi(params);
  const { data: dataId, isPending: isLoadingId } = usePurchaseIdApi(
    viewModal?.id
  );
  const { data: count } = useOperationCountApi(params, "purchase");

  const closeModal = () => {
    setViewModal({ isOpen: false, id: null });
  };

  return (
    <>
      <Filter
        type="purchase"
        isOpenFilter={isOpenFilter}
        setParams={setParams}
      />
      <div className="bg-white flex justify-between items-center w-full mb-5">
        <h2 className="text-lg font-semibold text-gray-800 ">Приходы</h2>
        <div className="flex gap-x-2">
          <Button
            icon={<MdOutlineFilterAltOff />}
            onClick={() => setIsOpenFilter(!isOpenFilter)}
          >
            Фильтр
          </Button>
          <Button
            icon={<FaPlus />}
            variant="solid"
            onClick={() => navigate("/purchase")}
          >
            Создать
          </Button>
        </div>
      </div>

      <TableHistory
        data={data ?? []}
        count={count}
        loading={isLoading}
        setParams={setParams}
        isOpenFilter={isOpenFilter}
        setViewModal={setViewModal}
        pay={true}
        payKey={"payout"}
        params={params}
        type="purchase"
      />

      <Dialog
        onClose={closeModal}
        title={`Приход № ${dataId?.number}`}
        isOpen={viewModal?.isOpen}
      >
        {!isLoadingId ? (
          <TransactionModal
            data={dataId}
            payKey={"payout"}
            viewModal={viewModal}
            type={"purchase"}
          />
        ) : (
          <div className="h-[70vh]">
            <Loading />
          </div>
        )}
      </Dialog>
    </>
  );
};
export default PurchaseHistory;

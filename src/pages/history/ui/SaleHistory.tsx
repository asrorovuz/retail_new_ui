import {
  useOperationCountApi,
  useSellApi,
  useSellIdApi,
} from "@/entities/history/repository";
import { Filter, TransactionModal } from "@/features/history";
import TableHistory from "@/features/history/ui/Table";
import { Button, Dialog } from "@/shared/ui/kit";
import Loading from "@/shared/ui/loading";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SaleHistory = () => {
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

  const { data, isLoading } = useSellApi(params);
  const { data: dataId, isPending: isLoadingId } = useSellIdApi(viewModal?.id);
  const { data: count } = useOperationCountApi(params, "sale");

  const closeModal = () => {
    setViewModal({ isOpen: false, id: null });
  };

  return (
    <>
      <Filter type="sale" isOpenFilter={isOpenFilter} setParams={setParams} />
      <div className="bg-white flex justify-between items-center w-full mb-5">
        <h2 className="text-lg font-semibold text-gray-800 ">Продажи</h2>
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
            onClick={() => navigate("/sales")}
          >
            Создать
          </Button>
        </div>
      </div>
      <TableHistory
        data={data ?? []}
        count={count}
        loading={isLoading}
        isOpenFilter={isOpenFilter}
        setParams={setParams}
        pay={true}
        setViewModal={setViewModal}
        payKey={"payment"}
        params={params}
        type="sale"
      />
      <Dialog
        onClose={closeModal}
        title={`Продажа № ${dataId?.number}`}
        isOpen={viewModal?.isOpen}
      >
        {!isLoadingId ? (
          <TransactionModal data={dataId} payKey={"payment"} viewModal={viewModal} type={"sale"}/>
        ) : (
          <div className="h-[70vh]">
            <Loading />
          </div>
        )}
      </Dialog>
    </>
  );
};

export default SaleHistory;

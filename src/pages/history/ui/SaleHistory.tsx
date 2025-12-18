import {
  useOperationCountApi,
  useSellApi,
} from "@/entities/history/repository";
import { Filter } from "@/features/history";
import TableHistory from "@/features/history/ui/Table";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineFilterAltOff } from "react-icons/md";

const SaleHistory = () => {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [params, setParams] = useState({
    skip: 0,
    limit: 10,
  });

  const { data, isLoading } = useSellApi(params);
  const { data: count } = useOperationCountApi(params, "sale");

  return (
    <div>
      <Filter type="sale" isOpenFilter={isOpenFilter} setParams={setParams} />
      <div className="bg-white flex justify-end gap-x-2 w-full mb-5">
        <Button
          icon={<MdOutlineFilterAltOff />}
          onClick={() => setIsOpenFilter(!isOpenFilter)}
        >
          Фильтр
        </Button>
        <Button icon={<FaPlus />} variant="solid">
          Создать
        </Button>
      </div>
      <div>
        <TableHistory
          data={data ?? []}
          count={count}
          loading={isLoading}
          setParams={setParams}
          pay={true}
          payKey={"payment"}
          params={params}
        />
      </div>
    </div>
  );
};

export default SaleHistory;

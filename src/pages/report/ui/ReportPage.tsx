import SearchProduct from "@/features/search-product";
import classNames from "@/shared/lib/classNames";
import { useDebounce } from "@/shared/lib/useDebounce";
import { DatePicker, Select } from "@/shared/ui/kit";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import dayjs from "dayjs";
import { useState } from "react";
import type { OptionsOrGroups } from "react-select";

const ReportPage = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [params, setParams] = useState({
    start_date: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
    end_date: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
    shift: null,
  });
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const shiftOptions: OptionsOrGroups<any, any> | undefined = [];

  console.dir(params);

  return (
    <div className="bg-white h-full rounded-2xl p-4">
      <NavigateButton content="Отчёты по продажам за период" />
      <div className="mb-3 grid grid-cols-4 gap-2 justify-between">
        <SearchProduct
          search={search}
          activeType="fullkey"
          setSearch={setSearch}
          setActiveType={() => {}}
          setSearchFocus={setSearchFocus}
          placeholder="Поиск контрагента"
        />

        <div className="relative">
          <DatePicker
            inputFormat="YYYY-DD-MM"
            size="sm"
            placeholder={"Дата начала"}
            closePickerOnChange={true}
            inputtable={true}
            value={params.start_date ? new Date(params.start_date) : null}
            onChange={(date) =>
              setParams((prev) => ({
                ...prev,
                start_date: dayjs(date)
                  .startOf("day")
                  .format("YYYY-MM-DD HH:mm"),
              }))
            }
          />
        </div>

        <div className="relative">
          <DatePicker
            inputFormat="YYYY-DD-MM"
            size="sm"
            placeholder={"Дата окончания"}
            closePickerOnChange={true}
            inputtable={true}
            value={params.end_date ? new Date(params.end_date) : null}
            onChange={(date) =>
              setParams((prev) => ({
                ...prev,
                end_date: dayjs(date).endOf("day").format("YYYY-MM-DD HH:mm"),
              }))
            }
          />
        </div>

        <Select
          options={shiftOptions}
          value={params.shift}
          size="sm"
          onChange={(option) =>
            setParams((prev) => ({
              ...prev,
              shift: option?.value || null,
            }))
          }
        />
      </div>
      <div
        className={classNames(
          "h-[46vh] flex flex-col mb-3",
          !searchFocus ? "h-[78vh]" : "h-[46vh]",
        )}
      >
        <div className="h-full mb-3 border border-slate-300 rounded-3xl overflow-auto"></div>
      </div>
      {searchFocus && <FullKeyboard />}
    </div>
  );
};

export default ReportPage;

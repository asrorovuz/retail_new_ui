import { messages } from "@/app/constants/message.request";
import {
  useAllProductApi,
  useCategoryApi,
  useCreateProduct,
  useCreateProductWithExcel,
  useCreateregister,
  useCurrancyApi,
  useUpdateProduct,
} from "@/entities/products/repository";
import { convertFilesToBase64 } from "@/shared/lib/convertFilesToBase64";
import {
  showErrorLocalMessage,
  showErrorMessage,
  showSuccessMessage,
} from "@/shared/lib/showMessage";
import {
  Button,
  Dialog,
  Input,
  InputGroup,
  Pagination,
  Select,
  Switcher,
  Table,
} from "@/shared/ui/kit";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Loading from "@/shared/ui/loading";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FaCloudDownloadAlt, FaRegEdit } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { LiaHourglassEndSolid } from "react-icons/lia";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import StatusBar from "@/widgets/ui/status-bar/StatusBar";
import { exportToExcel } from "@/shared/lib/arrayToExcelConvert";
import { handleError } from "@/shared/lib/handleErrorExcel";

interface InitialState {
  rowsCount: number;
  edit: boolean;
  currency: number;
}

interface StatusState {
  faild: number;
  success: number;
  total: number;
  totalData: number;
  status: boolean;
}

const optionSelect = [
  { label: "Название", value: "name" },
  { label: "Описание", value: "description" },
  { label: "Артикул", value: "sku" },
  { label: "Код", value: "code" },
  { label: "Штрих-код", value: "barcode" },
  { label: "Остаток", value: "state" },
  { label: "Единица измерения", value: "measurement" },
  { label: "Категория", value: "category" },
  { label: "Цена продажи", value: "commonPrice" },
  { label: "Закупочная цена", value: "purchasePrice" },
  { label: "ИКПУ-код", value: "taxCatalogCode" },
  { label: "ИКПУ-название", value: "taxCatalogName" },
  { label: "Код упаковки", value: "taxPackageCode" },
  { label: "Единица измерения (soliq.uz)", value: "taxMeasurement" },
  { label: "Льгота", value: "taxBenefit" },
  { label: "НДС", value: "taxRate" },
  { label: "ID системы", value: "id" },
  { label: "Название упаковки", value: "packageMeasurementName" },
  { label: "Количество в упаковке", value: "packageMeasurementQuantity" },
];

const INITIAL_PAGINATION = { pageIndex: 1, pageSize: 10 };
const INITIAL_STATUS: StatusState = {
  faild: 0,
  success: 0,
  total: 0,
  totalData: 0,
  status: true,
};

const generateBarcode = (): string => {
  return (
    Date.now().toString() + Math.floor(Math.random() * 1_000_000).toString()
  ).slice(-13);
};

const UploadExcelFile = () => {
  const { data: productData } = useAllProductApi();
  const { data: currencies } = useCurrancyApi();
  const { data: categoryData } = useCategoryApi();
  const { mutate: createWithExcel, isPending: loadingExcel } =
    useCreateProductWithExcel();
  const { mutate: createRegister } = useCreateregister();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const warhouseId = useSettingsStore((s) => s.wareHouseId);

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedSelect, setSelectedSelect] = useState<Record<number, string>>(
    {}
  );
  const [faildData, setFaildData] = useState<
    Array<{ index: number; row: (string | number | null)[] }>
  >([]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const [initialState, setInitialState] = useState<InitialState>({
    rowsCount: 1,
    edit: false,
    currency: currencies?.[0]?.code ?? 0,
  });
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [errorStatus, setErrorStatus] = useState<any[]>([]);
  const [successIndex, setSuccessIndex] = useState<number[]>([]);
  const [rememberData, setRememberData] = useState<any[]>([]);
  const [openStatusBar, setOpenStatusBar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseBar = useCallback(() => {
    setOpenStatusBar(false);
    const filterData = data
      ?.slice(initialState?.rowsCount)
      ?.filter((_, idx) => !successIndex.includes(idx));
    setData(filterData);
    setSuccessIndex([]);
    setStatus(INITIAL_STATUS);
  }, [data, initialState?.rowsCount, successIndex]);

  const clearFile = useCallback(() => {
    setSelectedSelect({});
    setInitialState({ rowsCount: 1, edit: false, currency: 0 });
    setData([]);
    setFaildData([]);
    setErrorStatus([]);
    setFile(null);
    setSuccessIndex([]);
    setRememberData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    clearFile();
  }, [clearFile]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      setSelectedSelect({});
      setPagination(INITIAL_PAGINATION);

      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const base64Files = await convertFilesToBase64([selectedFile]);
      createWithExcel(
        { content: base64Files[0].content },
        {
          onSuccess(response) {
            setData(response);
            showSuccessMessage(
              messages.uz.SUCCESS_MESSAGE,
              messages.ru.SUCCESS_MESSAGE
            );
            setFaildData([]);
          },
          onError(err) {
            showErrorMessage(err);
          },
        }
      );
    },
    [createWithExcel]
  );

  const downloadFailedExcel = () => {
    try {
      const failedRows = faildData.map(({ index, row }) => {
        const selectedCols = Object.keys(selectedSelect)
          .map(Number)
          .sort((a, b) => a - b)
          .map((colIndex) => row[colIndex] ?? "");

        return [...selectedCols, errorStatus[index] || "Неизвестная ошибка"];
      });

      if (failedRows.length === 0) {
        showErrorLocalMessage("Ошибочных данных нет");
        return;
      }

      const headers = Object.keys(selectedSelect)
        .map(Number)
        .sort((a, b) => a - b)
        .map(
          (i) =>
            optionSelect.find((opt) => opt.value === selectedSelect[i])
              ?.label ?? null
        );

      headers.push("Ошибка"); // oxirgi ustun

      exportToExcel([headers, ...failedRows], "Ошибочные файлы");
      showSuccessMessage(
        messages.uz.SUCCESS_MESSAGE,
        messages.ru.SUCCESS_MESSAGE
      );
    } catch (err) {
      showErrorMessage(err);
    }
  };

  const addProduct = async () => {
    const requiredFields = initialState?.edit
      ? ["name"]
      : ["name", "commonPrice"];

    for (const field of requiredFields) {
      if (!Object.values(selectedSelect).includes(field)) {
        showErrorLocalMessage(
          `Необходимо выбрать колонку для поля "${
            field === "name" ? "Название" : "Цена продажи"
          }"!`
        );
        return;
      }
    }

    setFaildData([]);
    setErrorStatus([]);
    setSuccessIndex([]);
    setRememberData([]);

    const sendData = data?.slice(initialState?.rowsCount);
    const sourceData = sendData && sendData.length > 0 ? sendData : data;

    if (!sourceData || sourceData.length === 0) return;

    const noSelectData = sourceData.map((item) => {
      const obj: Record<string, any> = {};
      Object.entries(selectedSelect).forEach(([colIndex, fieldName]) => {
        const value = item[Number(colIndex)];
        obj[fieldName] =
          typeof value === "string" ? String(value)?.trim() : value;
      });
      return obj;
    });

    const resultData = noSelectData?.map((elem) => {
      let product: any = productData?.find((p: any) => p?.name === elem?.name);
      let category: any = categoryData?.find(
        (p: any) => p?.name === elem?.category_name
      );

      return {
        id: initialState?.edit ? product?.id : undefined,
        name: elem?.name || "",
        purchase_price: {
          amount: elem?.purchasePrice
            ? Number(elem?.purchasePrice?.replace(",", ""))
            : null,
          currency_code: Number(initialState?.currency),
        },
        state: elem?.state || null,
        measurement_name: elem?.packageMeasurementName || "шт",
        sku: elem?.sku || null,
        code: elem?.code || null,

        barcodes: elem?.barcode ? [String(elem?.barcode)] : generateBarcode(),
        category_name: category?.name,
        category_id: category?.id,
        catalog_code: elem?.taxCatalogCode || null,
        catalog_name: elem?.taxCatalogName || null,
        count: elem?.packageMeasurementQuantity
          ? Number(elem?.packageMeasurementQuantity)
          : 1,
        prices: [
          {
            amount: elem?.commonPrice
              ? Number(elem?.commonPrice?.replace(",", ""))
              : 0,
            price_type_id: 1,
            currency_code: initialState?.currency,
          },
          {
            amount: elem?.bulkPrice
              ? Number(elem?.bulkPrice?.replace(",", ""))
              : 0,
            price_type_id: 2,
            currency_code: initialState?.currency,
          },
        ],
      };
    });

    setOpenStatusBar(true);

    setStatus((prev) => ({
      ...prev,
      totalData: resultData?.length,
    }));

    const startGlobalIndex =
      sendData && sendData.length > 0 ? Number(initialState?.rowsCount) : 0;
    let localSuccess = 0;
    let localFail = 0;
    const remData: any[] = [];

    // ✅ Har bir so'rovni ketma-ket yuborish uchun
    for (let i = 0; i < resultData?.length; i++) {
      const item: any = resultData[i];
      const globalIndex = startGlobalIndex + i;
      const { state, ...sendItem } = item;

      if (initialState?.edit && !sendItem?.id) {
        localFail++;

        handleError("notID", globalIndex, setErrorStatus);
        setFaildData((prev) => [
          ...prev,
          {
            index: globalIndex,
            row: sourceData[i],
          },
        ]);

        setStatus((prev) => ({
          ...prev,
          success: localSuccess,
          faild: localFail,
          total: localSuccess + localFail,
          totalData: resultData.length,
          status: true,
        }));

        continue;
      }

      // ✅ React Query mutateAsync ishlatamiz
      try {
        let res;

        if (initialState?.edit) {
          console.log(item, "item555");
          // updateProduct mutateAsync bilan
          res = await updateProduct({ productId: item?.id, data: sendItem });
        } else {
          // createProduct mutateAsync bilan
          res = await createProduct(sendItem);
        }

        // ✅ Muvaffaqiyatli bo'lsa
        setSuccessIndex((prev) => [...prev, globalIndex]);
        localSuccess++;

        setStatus((prev) => ({
          ...prev,
          success: localSuccess,
          faild: localFail,
          total: localSuccess + localFail,
          totalData: resultData.length,
          status: true,
        }));

        if (state) {
          remData.push({
            quantity: +state,
            warehouse_id: warhouseId,
            product_id: res?.id,
          });
        }
      } catch (err) {
        // ✅ Xato bo'lsa
        localFail++;
        handleError(err, globalIndex, setErrorStatus);
        setFaildData((prev) => [
          ...prev,
          { index: globalIndex, row: sourceData[i] },
        ]);
        setStatus((prev) => ({
          ...prev,
          success: localSuccess,
          faild: localFail,
          total: localSuccess + localFail,
          totalData: resultData.length,
          status: true,
        }));
      }
    }

    // ✅ Barcha so'rovlar tugagandan keyin
    setStatus((prev) => ({
      ...prev,
      status: false,
    }));

    setRememberData(remData);

    if (localSuccess === 0) {
      showErrorLocalMessage("Ошибка");
    }
  };

  useEffect(() => {
    if (rememberData?.length > 0) {
      createRegister(
        {
          is_approved: true,
          items: rememberData,
        },
        {
          onSuccess() {
            setRememberData([]);
          },
        }
      );
    }
  }, [rememberData]);

  return (
    <div>
      <Button onClick={onOpenModal} variant="solid">
        Загрузить Excel
      </Button>

      <Dialog
        width={"100vw"}
        height={"90vh"}
        title={"Загрузите Excel файл"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <div>
          {!file ? (
            <div className="relative border border-dashed border-gray-300 bg-gray-50 px-8 py-12 rounded-lg text-center mb-10">
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center text-gray-600"
              >
                <div className="flex items-center gap-x-2 mb-3">
                  <span>
                    <FaCloudDownloadAlt size={24} />
                  </span>
                  <span className="font-semibold text-lg">Выберите файл</span>
                </div>
                <span
                  className={`${file ? "text-gray-600" : "text-orange-600"}`}
                >
                  {/* {file
                    ? file?.name
                    : 'Нажмите, чтобы загрузить файл'} 
                */}
                  Нажмите, чтобы загрузить файл
                </span>
                <input
                  ref={fileInputRef}
                  id="fileInput"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            ""
          )}
          {data && data?.length ? (
            <>
              <ProductHeader
                count={data?.length - initialState?.rowsCount}
                initialState={initialState}
                faildData={faildData}
                setInitialState={setInitialState}
                // warehouseIds={warehouseIds}
                // setWarehouseIds={setWarehouseIds}
                downloadFailedExcel={downloadFailedExcel}
                addProduct={addProduct}
                clearFile={clearFile}
              />
              <RenderTable
                data={data}
                currencies={currencies}
                selectedSelect={selectedSelect}
                initialState={initialState}
                setInitialState={setInitialState}
                setSelectedSelect={setSelectedSelect}
                pagination={pagination}
                setPagination={setPagination}
              />
            </>
          ) : (
            <div className="h-20">{loadingExcel ? <Loading /> : ""}</div>
          )}
        </div>
      </Dialog>
      <StatusBar
        handleCloseBar={handleCloseBar}
        openStatusBar={openStatusBar}
        status={status}
      />
    </div>
  );
};

export default UploadExcelFile;

const ProductHeader = ({
  count,
  setInitialState,
  initialState,
  addProduct,
  faildData,
  // warehouseIds,
  downloadFailedExcel,
  clearFile,
}: // setWarehouseIds
{
  count: number;
  initialState: InitialState;
  faildData: any;
  setInitialState: (
    state: InitialState | ((prev: InitialState) => InitialState)
  ) => void;
  addProduct: () => void;
  downloadFailedExcel: () => void;
  clearFile: () => void;
}) => {
  const upDateInitialState = (
    field: keyof InitialState,
    value: string | number | boolean
  ) => {
    setInitialState((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncDec = (type: "+" | "-") => {
    setInitialState((prev: any) => ({
      ...prev,
      rowsCount: Math.max(0, Number(prev.rowsCount) + (type === "+" ? 1 : -1)),
    }));
  };

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-5 px-0.5">
        <h4 className="text-gray-700">
          Товары{" "}
          <span className="bg-orange-400 text-orange-900 p-1 text-[16px] rounded">
            {count}
          </span>
        </h4>
        <label
          htmlFor="edit"
          className="flex gap-x-2 items-center cursor-pointer hover:text-gray-600 font-semibold"
        >
          <Switcher
            id="edit"
            defaultChecked={initialState?.edit}
            onChange={(checked: boolean) => upDateInitialState("edit", checked)}
          />
          <span>Редактировать</span>
        </label>
      </div>
      <div className="flex justify-between items-center mb-5 px-0.5">
        <InputGroup className="px-0.5 flex w-[350px]">
          <Button className="z-10" onClick={() => handleIncDec("-")}>
            -
          </Button>
          <Input
            onChange={(e) => {
              const value = Number(e.target.value);
              upDateInitialState("rowsCount", isNaN(value) ? 0 : value);
            }}
            className="w-full text-center shadow-inner bg-white -mx-5"
            value={initialState?.rowsCount}
          />
          <Button className="z-10" onClick={() => handleIncDec("+")}>
            +
          </Button>
        </InputGroup>
        <div className="flex items-center gap-x-2">
          {faildData?.length ? (
            <Button
              onClick={downloadFailedExcel}
              className="bg-green-500 hover:bg-green-600"
              variant="solid"
              icon={<MdOutlineFileDownload size={20} />}
            >
              Скачать неудачные файлы
            </Button>
          ) : (
            ""
          )}
          {initialState?.edit ? (
            <Button
              onClick={addProduct}
              className="bg-orange-500 hover:bg-orange-600"
              icon={<FaRegEdit />}
              variant="solid"
              type="button"
            >
              Редактировать
            </Button>
          ) : (
            <Button
              onClick={addProduct}
              variant="solid"
              type="button"
              icon={<LiaHourglassEndSolid />}
            >
              Загрузить
            </Button>
          )}
          <Button
            icon={<BsFillTrashFill size={20} />}
            onClick={clearFile}
            type="button"
            variant="solid"
            size="sm"
            className="flex items-center gap-2 rounded-lg px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-400"
          >
            Очистить
          </Button>
        </div>
      </div>
    </div>
  );
};

const RenderTable = ({
  data,
  initialState,
  currencies,
  selectedSelect,
  setInitialState,
  setSelectedSelect,
  pagination,
  setPagination,
}: {
  data: any;
  initialState: InitialState;
  currencies: any;
  selectedSelect: any;
  pagination: any;
  setPagination: any;
  setInitialState: (
    state: InitialState | ((prev: InitialState) => InitialState)
  ) => void;
  setSelectedSelect: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
}) => {
  const activeCurrencies = currencies?.filter((item: any) => item?.is_active);
  const currencyOption = useMemo(() => {
    if (!currencies || !currencies.length) return [];
    return activeCurrencies.map((c: any) => ({
      value: c.code,
      label: c.name,
    }));
  }, [currencies]);

  useEffect(() => {
    setInitialState((prev) => ({
      ...prev,
      currency: activeCurrencies?.[0]?.code ?? 0,
    }));
  }, [currencies, activeCurrencies]);

  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = Array.isArray(data)
    ? data.slice(startIndex, endIndex)
    : [];

  const pageSizeOptions = [
    { label: "10 / Страница", value: 10 },
    { label: "25 / Страница", value: 25 },
    { label: "50 / Страница", value: 50 },
    { label: "100 / Страница", value: 100 },
    { label: "1000 / Страница", value: 1000 },
  ];

  return (
    <div
      style={{
        maxHeight: "calc(90vh - 210px)",
        overflowY: "auto",
        padding: "0 10px",
      }}
    >
      <Table cellBorder={true} className="w-full table-fixed">
        <THead className="sticky top-0 z-10">
          <Tr>
            <Th className="w-max">№</Th>
            {data[0]?.map((_: any, index: number) => (
              <>
                <Th className="bg-white">
                  <div className="flex w-[350px]">
                    <Select
                      placeholder={"Выбрать"}
                      isSearchable={false}
                      options={optionSelect.filter(
                        (opt) =>
                          !Object.values(selectedSelect).includes(opt.value) ||
                          selectedSelect[index] === opt.value
                      )}
                      classNamePrefix="react-select"
                      value={
                        optionSelect.find(
                          (opt) => opt.value === selectedSelect[index]
                        ) || null
                      }
                      onChange={(option) => {
                        setSelectedSelect((prev) => ({
                          ...prev,
                          [index]: option?.value || "",
                        }));
                      }}
                      isClearable={true}
                      className="relative text-left w-full"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (provided) => ({
                          ...provided,
                          borderRadius:
                            selectedSelect[index] === "commonPrice" ||
                            selectedSelect[index] === "purchasePrice"
                              ? "8px 0 0 8px"
                              : provided.borderRadius,
                        }),
                      }}
                    />
                    {(selectedSelect[index] === "commonPrice" ||
                      selectedSelect[index] === "purchasePrice") &&
                      (currencyOption?.length > 1 ? (
                        <Select
                          placeholder={"Выбрать"}
                          options={currencyOption}
                          isSearchable={false}
                          value={
                            initialState?.currency
                              ? currencyOption.find(
                                  (w: any) => w.value === initialState?.currency
                                )
                              : null
                          }
                          classNamePrefix="react-select"
                          onChange={(option) =>
                            setInitialState((prev: any) => ({
                              ...prev,
                              currency: option?.value || "",
                            }))
                          }
                          className="relative text-left w-[120px] cursor-pointer"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: "#3B82F6",
                              color: "#fff",
                              boxShadow: "none",
                              borderColor: "#3b82f6",
                              borderRadius: "0 8px 8px 0",
                            }),
                            singleValue: (provided: any) => ({
                              ...provided,
                              color: "#fff",
                            }),
                          }}
                        />
                      ) : (
                        <div className="bg-blue-500 border border-blue-500 text-white w-[120px] flex justify-center rounded-r-md items-center text-[16px]">
                          {currencyOption[0]?.label}
                        </div>
                      ))}
                  </div>
                </Th>
              </>
            ))}
          </Tr>
        </THead>
        <TBody>
          {paginatedData?.map((elem: string[], index: number) => {
            const globalIndex = startIndex + index + 1; // butun jadvaldagi raqam
            const highlight = Number(initialState?.rowsCount) >= globalIndex;
            return (
              <Tr
                key={`row-${globalIndex}`}
                className={`h-14 ${highlight ? "bg-gray-200" : "bg-white"}`}
              >
                <Td>
                  <div className="w-max px-3">{globalIndex}</div>
                </Td>
                {elem?.map((item, i) => (
                  <Td key={i}>
                    <div className="w-[350px] px-3">{item}</div>
                  </Td>
                ))}
              </Tr>
            );
          })}
        </TBody>
      </Table>
      <div className="flex justify-between py-4">
        <Pagination
          total={data?.length}
          pageSizeOptions={[10, 25, 50, 100, 1000]}
          currentPage={pagination?.pageIndex}
          showSizeOption={false}
          pageSize={pagination?.pageSize}
          onChange={(pageNumber: number) => {
            console.log(pageNumber);

            setPagination((prev: any) => ({
              ...prev,
              pageIndex: pageNumber,
            }));
          }}
        />
        <Select
          className="w-[180px] bg-transparent border-0"
          options={pageSizeOptions}
          isSearchable={false}
          value={pageSizeOptions.find(
            (opt) => opt.value === pagination.pageSize
          )}
          size="sm"
          menuPlacement="top"
          onChange={(selected) =>
            setPagination((prev: any) => ({
              ...prev,
              pageSize: selected?.value || 10,
              pageIndex: 1,
            }))
          }
        />
      </div>
    </div>
  );
};

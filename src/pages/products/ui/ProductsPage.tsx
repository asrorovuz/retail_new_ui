import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useAllInfoProductApi,
  useExportProductWithExcel,
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import DownloadFileForScales from "@/features/download-scale/DownloadFileForScale";
import { FilterTable } from "@/features/filter-table";
import type { FilterParams } from "@/features/filter-table/ui/options";
import { AddMoreProducts } from "@/features/modals";
import AddProductModal from "@/features/modals/ui/AddProductModal";
import ProductTable from "@/features/products";
import InfoModal from "@/features/products/ui/InfoModal";
import SearchProduct from "@/features/search-product";
import UploadExcelFile from "@/features/upload-excel-file";
import { exportToExcelApi } from "@/shared/lib/arrayToExcelConvert";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { Button, Dropdown } from "@/shared/ui/kit";
import DropdownItem from "@/shared/ui/kit/Dropdown/DropdownItem";
import { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { PiMicrosoftExcelLogo } from "react-icons/pi";

// type FilterType = "all" | "white" | "black";
// type FilterOption = {
//   label: string;
//   value: FilterType;
// };

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isOpenExcel, setIsOpenExcel] = useState(false);
  const [showInformation, setShowInformation] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });
  const [filterParams, setFilterParams] = useState<FilterParams>({
    is_legal: null,
    category_exists: null,
    category_id: null,
    state: null,
    measurement_code: null,
    sku: null,
    sku_exists: null,
    code: null,
    code_exists: null,
    barcode_exists: null,
    catalog_code_exists: null,
    sort: null,
    is_selling_at_loss: null,
  });

  const { data: productPriceType } = usePriceTypeApi();
  const {
    data: findBarcodeData,
    isError,
    isFetching,
    isSuccess,
  } = useFindBarcode(barcode);
  const { data: infoData } = useAllInfoProductApi(
    undefined,
    undefined,
    search,
    filterParams,
  );
  const { mutate: exportProductWithExcel, isPending } =
    useExportProductWithExcel();

  const { settings } = useSettingsStore((s) => s);

  const handleExport = () => {
    exportProductWithExcel(filterParams, {
      onSuccess(data) {
        exportToExcelApi(data, "products");
      },
      onError() {
        showErrorLocalMessage("Ошибка при экспорте");
      },
    });
  };

  useEffect(() => {
    const onScan = eventBus.on("BARCODE_SCANNED", (code) => {
      const val: string = handleBarcodeScanned(code);
      setBarcode(val);
    });

    return () => {
      eventBus.remove("BARCODE_SCANNED", onScan);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && !isFetching && !isAddOpen && !isOpen && findBarcodeData) {
      setSearch(String(barcode));
      setBarcode(null); // qayta so‘rov yubormaslik uchun tozalaymiz
    }
  }, [isSuccess, findBarcodeData, isFetching]);

  useEffect(() => {
    if (isAddOpen || isOpen) return;
    if (isError) {
      if (settings?.enable_create_unknown_product && !isOpen) {
        setIsAddOpen(true);
      } else {
        showErrorLocalMessage("Товар не найден");
        setBarcode(null);
      }
    }
  }, [isError]);

  return (
    <div className="bg-white rounded-3xl p-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div className="mb-3 flex items-center gap-x-2">
        <SearchProduct setSearch={setSearch} search={search} />
        <Button
          size="sm"
          variant="solid"
          type="button"
          icon={<i className="ri-filter-line text-lg" />}
          onClick={() => setOpenFilter(!openFilter)}
        >
          Фильтр
        </Button>
        <Button
          size="sm"
          variant="solid"
          type="button"
          loading={isPending}
          icon={<i className="ri-filter-line text-lg" />}
          onClick={handleExport}
        >
          Экспорт
        </Button>

        <Button
          size="sm"
          variant="solid"
          type="button"
          onClick={() => setShowInformation(true)}
        >
          Информация
        </Button>
        <DownloadFileForScales />
        <Dropdown
          toggleClassName="text-2xl text-gray-600 flex justify-center"
          renderTitle={
            <span className="cursor-pointer">
              <HiOutlineDotsHorizontal />
            </span>
          }
        >
          <DropdownItem onClick={() => setIsAddOpen(true)} className="h-auto!">
            <div className="w-full flex items-center gap-2 text-gray-700 py-3 px-5 rounded-xl">
              <span className="text-green-700">
                <CiSquarePlus size={20} />
              </span>{" "}
              Добавить товар
            </div>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setIsOpen(true);
            }}
            className="h-auto!"
          >
            <div className="w-full flex items-center gap-2  py-3 px-5 rounded-xl">
              <span className="text-green-700">
                <CiSquarePlus size={20} />
              </span>{" "}
              Добавить несколько товаров
            </div>
          </DropdownItem>
          <DropdownItem
            onClick={() => setIsOpenExcel(true)}
            className="h-auto!"
          >
            <div className="w-full flex items-center gap-2  py-3 px-5 rounded-xl">
              <span className="text-green-700">
                <PiMicrosoftExcelLogo size={20} />
              </span>{" "}
              Импорт из Excel
            </div>
          </DropdownItem>
        </Dropdown>
        
      </div>
      <AddProductModal
        type={"add"}
        pageType={"products"}
        setBarcode={setBarcode}
        barcode={barcode}
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        productPriceType={productPriceType!}
      />
      <UploadExcelFile isOpen={isOpenExcel} setIsOpen={setIsOpenExcel} />
      <AddMoreProducts
        barcode={barcode}
        setBarcode={setBarcode}
        productPriceType={productPriceType}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <FilterTable
        openFilter={openFilter}
        filterParams={filterParams}
        setFilterParams={setFilterParams}
      />
      <ProductTable
        search={search}
        setBarcode={setBarcode}
        filterParams={filterParams}
        barcode={barcode}
        setIsOpen={setIsEditOpen}
        isOpen={isEditOpen}
        productPriceType={productPriceType!}
        pagination={pagination}
        setPagination={setPagination}
      />
      <InfoModal
        isOpen={showInformation}
        setIsOpen={setShowInformation}
        infoData={infoData}
      />
    </div>
  );
};

export default ProductsPage;

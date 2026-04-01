import SearchProduct from "@/features/search-product";
import { Button, Dialog, Dropdown, Select } from "@/shared/ui/kit";
import {
    artiklOptions,
    barcodeOptions,
    categoryOptions,
    defaultParams,
    isLegalOptions,
    measurmentOptions,
    mxikOptions,
    packageCodeOptions,
    purchaseGreaterThanSaleOptions,
    sortOptions,
    stateOptions,
    type FilterParams,
} from "../select-params";
import {
    selectStyles,
    type SelectOption,
} from "@/features/product/select-params";
import { useMemo, useState } from "react";
import {
    useAllInfoProductApi,
    useCategoryApi,
    useExportProductWithExcel,
} from "@/entities/products/repository";
import InfoModal from "./InfoModal";
import { VscListFilter } from "react-icons/vsc";
import { exportToExcelApi } from "@/shared/lib/arrayToExcelConvert";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import DownloadFileForScales from "@/features/download-scale/DownloadFileForScale";
import DropdownItem from "@/shared/ui/kit/Dropdown/DropdownItem";
import { CiSquarePlus } from "react-icons/ci";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import UpdateCatalogCode from "@/features/update-catalog-code/ui/UpdateCatalogCode";
import { FiRefreshCw } from "react-icons/fi";

const ProductHeader = ({
    search,
    filterParams,
    setActiveType,
    setSearchFocus,
    setSearch,
    setFilterParams,
    setIsAddOpen,
    setIsOpen,
    setIsOpenExcel,
}: any) => {
    const [openFilter, setOpenFilter] = useState(false);
    const [showInformation, setShowInformation] = useState(false);
    const [isUpdateCatalogCodeOpen, setIsUpdateCatalogCodeOpen] = useState(false);

    const { data: categoryData } = useCategoryApi();
    const { data: infoData } = useAllInfoProductApi(
        undefined,
        undefined,
        search,
        filterParams,
    );
    const { mutate: exportProductWithExcel, isPending } =
        useExportProductWithExcel();

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

    const categoryItemOptions = useMemo<SelectOption[]>(() => {
        if (!Array.isArray(categoryData)) return [];
        return categoryData.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }, [categoryData]);

    return (
        <div className="mb-3 flex items-center justify-between">
            <div className="w-[433px] flex items-center gap-x-2">
                <SearchProduct
                    search={search}
                    pageType={false}
                    activeType="fullkey"
                    setActiveType={setActiveType}
                    setSearch={setSearch}
                    setSearchFocus={setSearchFocus}
                />
                {/* Остаток */}
                <Select
                    className="w-[276px]"
                    options={stateOptions}
                    placeholder="Остатки товары"
                    isSearchable={false}
                    value={stateOptions.find(
                        (opt) => opt.value === filterParams?.state,
                    )}
                    onChange={(option: SelectOption | null) =>
                        setFilterParams((prev: FilterParams) => ({
                            ...prev,
                            state: option?.value as FilterParams["state"],
                        }))
                    }
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                />
            </div>
            <div className="flex items-center gap-x-2">
                <Button
                    size="sm"
                    variant="default"
                    type="button"
                    className="text-sm font-semibold"
                    icon={<VscListFilter size={20} />}
                    onClick={() => setOpenFilter(!openFilter)}
                />
                <Button
                    size="sm"
                    variant="default"
                    type="button"
                    className="text-sm font-medium"
                    onClick={() => setShowInformation(true)}
                >
                    Отчеть
                </Button>
                <Button
                    size="sm"
                    variant="default"
                    type="button"
                    loading={isPending}
                    icon={<i className="ri-filter-line text-lg" />}
                    onClick={handleExport}
                >
                    Экспорт в Excel
                </Button>

                <DownloadFileForScales />

                <Dropdown
                    toggleClassName="text-base text-slate-600 flex justify-center"
                    renderTitle={<Button size="sm">Добавить</Button>}
                >
                    <DropdownItem
                        onClick={() => setIsAddOpen(true)}
                        className="h-auto!"
                    >
                        <div className="w-full flex items-center gap-2 text-slate-700 py-3 px-5 rounded-xl">
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

                    <DropdownItem
                        onClick={() => setIsUpdateCatalogCodeOpen(true)}
                        className="h-auto!"
                    >
                        <div className="w-full flex items-center gap-2  py-3 px-5 rounded-xl">
                            <span className="text-orange-700">
                                <FiRefreshCw size={20} />
                            </span>{" "}
                            Обновить код ИКПУ
                        </div>
                    </DropdownItem>
                </Dropdown>
            </div>

            <InfoModal
                isOpen={showInformation}
                setIsOpen={setShowInformation}
                infoData={infoData}
            />

            <UpdateCatalogCode isOpen={isUpdateCatalogCodeOpen} setIsOpen={setIsUpdateCatalogCodeOpen} />

            <Dialog
                onClose={() => setOpenFilter(false)}
                isOpen={openFilter}
                width={"80vw"}
                overlayClassName={"!backdrop-filter-none"}
                onRequestClose={() => setOpenFilter(false)}
                title={"Фильтр"}
            >
                <div className="grid grid-cols-4 gap-4 mb-5">
                    <div className="flex flex-col col-span-1 gap-1">
                        <label className="text-sm text-slate-600">Товар</label>
                        <Select
                            options={isLegalOptions}
                            value={isLegalOptions.find(
                                (o) => o.value === filterParams.is_legal,
                            )}
                            onChange={(option) =>
                                option &&
                                setFilterParams({
                                    ...filterParams,
                                    is_legal:
                                        option.value as FilterParams["is_legal"],
                                })
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>
                    {/* Категория */}
                    <div className="flex flex-col col-span-1 gap-1">
                        <label className="text-sm text-slate-600">
                            Категория
                        </label>
                        <Select
                            options={categoryOptions}
                            placeholder="Выберите"
                            value={categoryOptions.find(
                                (opt) =>
                                    opt.value === filterParams.category_exists,
                            )}
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    category_exists:
                                        option?.value as FilterParams["category_exists"],
                                }))
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Категория товара */}
                    <div className="flex flex-col col-span-2 gap-1">
                        <label className="text-sm text-slate-600">
                            Категория товара
                        </label>
                        <Select
                            options={categoryItemOptions}
                            placeholder="Выберите категорию"
                            value={
                                categoryItemOptions.find(
                                    (opt) =>
                                        opt.value === filterParams.category_id,
                                ) ?? null
                            }
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    category_id: option?.value
                                        ? Number(option.value)
                                        : null,
                                }))
                            }
                            isClearable
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Единица измерения */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            Единица измерения
                        </label>
                        <Select
                            options={measurmentOptions}
                            placeholder="Выберите"
                            value={
                                measurmentOptions.find(
                                    (opt) =>
                                        opt.value ===
                                        filterParams.measurement_code,
                                ) ?? null
                            }
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    measurement_code:
                                        option?.value !== undefined &&
                                        option?.value !== null
                                            ? Number(option.value)
                                            : null,
                                }))
                            }
                            isClearable
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Артикул */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            Артикул
                        </label>
                        <Select
                            options={artiklOptions}
                            placeholder="Выберите"
                            value={artiklOptions.find(
                                (opt) => opt.value === filterParams.sku_exists,
                            )}
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    sku_exists:
                                        option?.value as FilterParams["sku_exists"],
                                }))
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Штрих-код */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            Штрих-код
                        </label>

                        <Select
                            options={barcodeOptions}
                            placeholder="Выберите"
                            value={barcodeOptions.find(
                                (opt) =>
                                    opt.value === filterParams.barcode_exists,
                            )}
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    barcode_exists:
                                        option?.value as FilterParams["barcode_exists"],
                                }))
                            }
                            getOptionLabel={(opt) => opt.label}
                            getOptionValue={(opt) => String(opt.value)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* МХИК */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            Код МХИК
                        </label>

                        <Select
                            options={mxikOptions}
                            placeholder="Выберите"
                            value={mxikOptions.find(
                                (opt) =>
                                    opt.value ===
                                    filterParams.catalog_code_exists,
                            )}
                            onChange={(option: SelectOption | null) => {
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    catalog_code_exists:
                                        option?.value as FilterParams["catalog_code_exists"],
                                }));
                            }}
                            getOptionLabel={(opt) => opt.label}
                            getOptionValue={(opt) => String(opt.value)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Код упаковки */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            Код упаковки
                        </label>

                        <Select
                            options={packageCodeOptions}
                            placeholder="Выберите"
                            value={packageCodeOptions.find(
                                (opt) => opt.value === filterParams.code_exists,
                            )}
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    code_exists:
                                        option?.value as FilterParams["code_exists"],
                                }))
                            }
                            getOptionLabel={(opt) => opt.label}
                            getOptionValue={(opt) => String(opt.value)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Saralash */}
                    <div className="flex flex-col col-span-2 gap-1">
                        <label className="text-sm text-slate-600">
                            Сортировка
                        </label>

                        <Select
                            options={sortOptions}
                            placeholder="Выберите"
                            value={sortOptions.find(
                                (opt) => opt.value === filterParams.sort,
                            )}
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    sort: option?.value as FilterParams["sort"],
                                }))
                            }
                            getOptionLabel={(opt) => opt.label}
                            getOptionValue={(opt) => String(opt.value)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Кирим нархи сотув нархидан каттами */}
                    <div className="flex flex-col gap-1">
                        <label
                            title="Закупочная цена выше продажной"
                            className="text-sm text-ellipsis line-clamp-1 text-slate-600"
                        >
                            Закупочная цена выше продажной
                        </label>

                        <Select
                            options={purchaseGreaterThanSaleOptions}
                            placeholder="Выберите"
                            value={purchaseGreaterThanSaleOptions.find(
                                (opt) =>
                                    opt.value ===
                                    filterParams.is_selling_at_loss,
                            )}
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    is_selling_at_loss:
                                        option?.value as FilterParams["is_selling_at_loss"],
                                }))
                            }
                            getOptionLabel={(opt) => opt.label}
                            getOptionValue={(opt) => String(opt.value)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>
                    <div className="grid col-span-4">
                        <Button
                            size="sm"
                            type="button"
                            variant="solid"
                            onClick={() => setFilterParams(defaultParams)}
                        >
                            Сбросить
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ProductHeader;

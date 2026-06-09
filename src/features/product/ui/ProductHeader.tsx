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
import BulkDeleteModal from "./BulkDeleteModal";
import { FiRefreshCw } from "react-icons/fi";
import { AccountPermissions } from "@/app/constants/permissions";
import { useCheckPermission } from "@/shared/lib/checkPermission";
import { useCategoryApi } from "@/entities/categories/repository";
import { IoTrashOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const ProductHeader = ({
    search,
    filterParams,
    setActiveType,
    setSearchFocus,
    setSearch,
    setFilterParams,
    setIsAddOpen,
    setIsOpen,
    setBarcode,
    setIsOpenExcel,
}: any) => {
    const { t } = useTranslation();
    const [openFilter, setOpenFilter] = useState(false);
    const [showInformation, setShowInformation] = useState(false);
    const [isUpdateCatalogCodeOpen, setIsUpdateCatalogCodeOpen] =
        useState(false);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    const checkPermission = useCheckPermission();

    const { data: categoryData } = useCategoryApi();
    const { data: infoData } = useAllInfoProductApi(
        undefined,
        undefined,
        search,
        filterParams,
    );
    const { mutate: exportProductWithExcel } = useExportProductWithExcel();

    const handleExport = () => {
        const cleanedParams = Object.fromEntries(
            Object.entries(filterParams || {}).filter(
                ([_, value]) => value !== null && value !== undefined,
            ),
        );

        exportProductWithExcel(cleanedParams, {
            onSuccess(data) {
                exportToExcelApi(data, "products");
            },
            onError() {
                showErrorLocalMessage(t("common.exportError"));
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
        <div className="mb-3 flex items-center justify-between gap-x-1">
            <div className=" flex items-center gap-x-1">
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
                    className="w-[200px]"
                    options={stateOptions}
                    placeholder={t("product.stock")}
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
                <Select
                    options={categoryItemOptions}
                    placeholder={t("product.category")}
                    value={
                        categoryItemOptions.find(
                            (opt) => opt.value === filterParams.category_id,
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
                    isSearchable={false}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    isClearable
                    styles={selectStyles}
                />
            </div>
            <div className="flex items-center gap-x-1">
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
                    {t("common.report")}
                </Button>

                <DownloadFileForScales handleExport={handleExport} />

                <Dropdown
                    toggleClassName="text-base text-slate-600 flex justify-center"
                    renderTitle={
                        <Button variant="solid" size="sm">
                            + {t("common.add")}
                        </Button>
                    }
                >
                    {checkPermission(
                        AccountPermissions.AccountPermissionProductCreate,
                    ) && (
                        <>
                            <DropdownItem
                                onClick={() => {
                                    setIsAddOpen(true);
                                    setBarcode(null);
                                    setSearch("");
                                }}
                                className="h-auto!"
                            >
                                <div className="w-full flex items-center gap-2 text-slate-700 py-3 px-5 rounded-xl">
                                    <span className="text-green-700">
                                        <CiSquarePlus size={20} />
                                    </span>{" "}
                                    {t("product.addProduct")}
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
                                    {t("product.addMultiple")}
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
                                    {t("product.importExcel")}
                                </div>
                            </DropdownItem>

                            {checkPermission(
                                AccountPermissions.AccountPermissionProductDelete,
                            ) && (
                                <DropdownItem
                                    onClick={() => setIsBulkDeleteOpen(true)}
                                    className="h-auto! text-red-500 hover:text-red-600"
                                >
                                    <div className="w-full flex items-center gap-2  py-3 px-5 rounded-xl">
                                        <span className="text-red-500">
                                            <IoTrashOutline size={20} />
                                        </span>{" "}
                                        {t("product.deleteSelected")}
                                    </div>
                                </DropdownItem>
                            )}
                        </>
                    )}

                    <DropdownItem
                        onClick={() => setIsUpdateCatalogCodeOpen(true)}
                        className="h-auto!"
                    >
                        <div className="w-full flex items-center gap-2  py-3 px-5 rounded-xl">
                            <span className="text-orange-700">
                                <FiRefreshCw size={20} />
                            </span>{" "}
                            {t("product.updateIkpu")}
                        </div>
                    </DropdownItem>
                </Dropdown>
            </div>

            <InfoModal
                isOpen={showInformation}
                setIsOpen={setShowInformation}
                infoData={infoData}
            />

            <UpdateCatalogCode
                isOpen={isUpdateCatalogCodeOpen}
                setIsOpen={setIsUpdateCatalogCodeOpen}
            />

            <BulkDeleteModal
                isOpen={isBulkDeleteOpen}
                setIsOpen={setIsBulkDeleteOpen}
            />

            <Dialog
                onClose={() => setOpenFilter(false)}
                isOpen={openFilter}
                width={"80vw"}
                overlayClassName={"!backdrop-filter-none"}
                onRequestClose={() => setOpenFilter(false)}
                title={t("common.filter")}
            >
                <div className="grid grid-cols-4 gap-4 mb-5">
                    <div className="flex flex-col col-span-1 gap-1">
                        <label className="text-sm text-slate-600">{t("product.products")}</label>
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
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>
                    {/* Категория */}
                    <div className="flex flex-col col-span-1 gap-1">
                        <label className="text-sm text-slate-600">
                            {t("product.category")}
                        </label>
                        <Select
                            options={categoryOptions}
                            placeholder={t("common.select")}
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
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Категория товара */}
                    {/* <div className="flex flex-col col-span-2 gap-1">
                        <label className="text-sm text-slate-600">
                            Категория товара
                        </label>
                        
                    </div> */}

                    {/* Единица измерения */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            {t("product.unit")}
                        </label>
                        <Select
                            options={measurmentOptions}
                            placeholder={t("common.select")}
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
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Артикул */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            {t("product.sku")}
                        </label>
                        <Select
                            options={artiklOptions}
                            placeholder={t("common.select")}
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
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Штрих-код */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-600">
                            {t("product.barcode")}
                        </label>

                        <Select
                            options={barcodeOptions}
                            placeholder={t("common.select")}
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
                            isSearchable={false}
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
                            {t("product.catalogCode")}
                        </label>

                        <Select
                            options={mxikOptions}
                            placeholder={t("common.select")}
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
                            isSearchable={false}
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
                            {t("product.code")}
                        </label>

                        <Select
                            options={packageCodeOptions}
                            placeholder={t("common.select")}
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
                            isSearchable={false}
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
                            {t("common.sort")}
                        </label>

                        <Select
                            options={sortOptions}
                            placeholder={t("common.select")}
                            value={sortOptions.find(
                                (opt) => opt.value === filterParams.sort,
                            )}
                            onChange={(option: SelectOption | null) =>
                                setFilterParams((prev: FilterParams) => ({
                                    ...prev,
                                    sort: option?.value as FilterParams["sort"],
                                }))
                            }
                            isSearchable={false}
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
                            title={t("product.purchaseAboveSale")}
                            className="text-sm text-ellipsis line-clamp-1 text-slate-600"
                        >
                            {t("product.purchaseAboveSale")}
                        </label>

                        <Select
                            options={purchaseGreaterThanSaleOptions}
                            placeholder={t("common.select")}
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
                            isSearchable={false}
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
                            {t("common.reset")}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ProductHeader;

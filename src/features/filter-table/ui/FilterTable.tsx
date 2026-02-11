import { Select } from "@/shared/ui/kit";
import {
  artiklOptions,
  barcodeOptions,
  categoryOptions,
  isLegalOptions,
  measurmentOptions,
  mxikOptions,
  packageCodeOptions,
  purchaseGreaterThanSaleOptions,
  sortOptions,
  stateOptions,
  type FilterParams,
} from "./options";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { useCategoryApi } from "@/entities/products/repository";

type SelectOption = {
  label: string;
  value: string | number | boolean | null;
};

type FilterTableProps = {
  openFilter: boolean;
  filterParams: FilterParams;
  setFilterParams: Dispatch<SetStateAction<FilterParams>>;
};

const FilterTable = ({
  openFilter,
  filterParams,
  setFilterParams,
}: FilterTableProps) => {
  const { data: categoryData } = useCategoryApi();

  const categoryItemOptions = useMemo<SelectOption[]>(() => {
    if (!Array.isArray(categoryData)) return [];
    return categoryData.map((item) => ({
      label: item.name,
      value: String(item.id),
    }));
  }, [categoryData]);

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "white",
      borderRadius: "0.5rem",
      borderColor: "#d9d9d9",
      boxShadow: "none",
      minHeight: "38px",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "white",
      borderRadius: "0.5rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#e6f0ff"
        : state.isFocused
          ? "#f5f5f5"
          : "white",
      color: "#000",
      cursor: "pointer",
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div
      className={`
        overflow-hidden
        transition-all duration-300 ease-in-out
        ${
          openFilter
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }
      `}
    >
      <h3 className="font-medium mb-4">Фильтры</h3>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Товар</label>
          <Select
            options={isLegalOptions}
            value={isLegalOptions.find(
              (o) => o.value === filterParams.is_legal,
            )}
            onChange={(option) =>
              option &&
              setFilterParams({
                ...filterParams,
                is_legal: option.value as FilterParams["is_legal"],
              })
            }
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={selectStyles}
          />
        </div>
        {/* Категория */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Категория</label>
          <Select
            options={categoryOptions}
            placeholder="Выберите"
            value={categoryOptions.find(
              (opt) => opt.value === filterParams.category_exists,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
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
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Категория товара</label>
          <Select
            options={categoryItemOptions}
            placeholder="Выберите категорию"
            value={categoryItemOptions.find(
              (opt) => opt.value === filterParams.category_id,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
                ...prev,
                category_id: option?.value ? Number(option.value) : null,
              }))
            }
            isClearable
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={selectStyles}
          />
        </div>

        {/* Остаток */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Остаток</label>
          <Select
            options={stateOptions}
            placeholder="Выберите"
            value={stateOptions.find(
              (opt) => opt.value === filterParams?.state,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
                ...prev,
                state: option?.value as FilterParams["state"],
              }))
            }
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={selectStyles}
          />
        </div>

        {/* Единица измерения */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Единица измерения</label>
          <Select
            options={measurmentOptions}
            placeholder="Выберите"
            value={measurmentOptions.find(
              (opt) => opt.value === filterParams.measurement_code,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
                ...prev,
                measurement_code:
                  option?.value !== undefined && option?.value !== null
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
          <label className="text-sm text-gray-600">Артикул</label>
          <Select
            options={artiklOptions}
            placeholder="Выберите"
            value={artiklOptions.find(
              (opt) => opt.value === filterParams.sku_exists,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
                ...prev,
                sku_exists: option?.value as FilterParams["sku_exists"],
              }))
            }
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={selectStyles}
          />
        </div>

        {/* Штрих-код */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Штрих-код</label>

          <Select
            options={barcodeOptions}
            placeholder="Выберите"
            value={barcodeOptions.find(
              (opt) => opt.value === filterParams.barcode_exists,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
                ...prev,
                barcode_exists: option?.value as FilterParams["barcode_exists"],
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
          <label className="text-sm text-gray-600">Код МХИК</label>

          <Select
            options={mxikOptions}
            placeholder="Выберите"
            value={mxikOptions.find(
              (opt) => opt.value === filterParams.catalog_code_exists,
            )}
            onChange={(option: SelectOption | null) => {
              setFilterParams((prev) => ({
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
          <label className="text-sm text-gray-600">Код упаковки</label>

          <Select
            options={packageCodeOptions}
            placeholder="Выберите"
            value={packageCodeOptions.find(
              (opt) => opt.value === filterParams.code_exists,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
                ...prev,
                code_exists: option?.value as FilterParams["code_exists"],
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
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Сортировка</label>

          <Select
            options={sortOptions}
            placeholder="Выберите"
            value={sortOptions.find((opt) => opt.value === filterParams.sort)}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
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
          <label className="text-sm text-gray-600">
            Закупочная цена выше продажной
          </label>

          <Select
            options={purchaseGreaterThanSaleOptions}
            placeholder="Выберите"
            value={purchaseGreaterThanSaleOptions.find(
              (opt) => opt.value === filterParams.is_selling_at_loss,
            )}
            onChange={(option: SelectOption | null) =>
              setFilterParams((prev) => ({
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
      </div>
    </div>
  );
};

export default FilterTable;

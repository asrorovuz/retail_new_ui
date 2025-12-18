import { useState, useEffect, useMemo } from "react";
import Pager from "./Pagers";
import Prev from "./Prev";
import Next from "./Next";
import Total from "./Total";
import useControllableState from "../hooks/useControllableState";
import classNames from "classnames";
import type { CommonProps } from "../@types/common";

export interface PaginationProps extends CommonProps {
  currentPage?: number;
  displayTotal?: boolean;
  onChange?: (pageNumber: number, pageSize?: number) => void;
  pageSize?: number;
  total?: number;
  showSizeOption?: boolean;
  pageSizeOptions?: number[]; // 🔹 qo‘shildi: sahifa o‘lcham variantlari
}

const defaultTotal = 5;

const Pagination = (props: PaginationProps) => {
  const {
    className,
    currentPage = 1,
    displayTotal = false,
    onChange,
    pageSize = 20,
    total = 5,
    showSizeOption = true,
    pageSizeOptions = [10, 25, 50, 100, 1000], // 🔹 default variantlar
  } = props;

  const [paginationTotal] = useControllableState({
    prop: total,
    defaultProp: defaultTotal,
    onChange,
  });

  const [internalPageSize, setInternalPageSize] = useState(pageSize);

  const getInternalPageCount = useMemo(() => {
    if (typeof paginationTotal === "number") {
      return Math.ceil(paginationTotal / internalPageSize);
    }
    return null;
  }, [paginationTotal, internalPageSize]);

  const getValidCurrentPage = (count: number | string) => {
    const value = parseInt(count as string, 10);
    const internalPageCount = getInternalPageCount;
    let resetValue;
    if (!internalPageCount) {
      if (isNaN(value) || value < 1) {
        resetValue = 1;
      }
    } else {
      if (value < 1) resetValue = 1;
      if (value > internalPageCount) resetValue = internalPageCount;
    }
    if ((resetValue === undefined && isNaN(value)) || resetValue === 0) {
      resetValue = 1;
    }
    return resetValue === undefined ? value : resetValue;
  };

  const [internalCurrentPage, setInternalCurrentPage] = useState(
    currentPage ? getValidCurrentPage(currentPage) : 1
  );

  useEffect(() => {
    if (pageSize !== internalPageSize) {
      setInternalPageSize(pageSize);
    }

    if (currentPage !== internalCurrentPage) {
      setInternalCurrentPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage]);

  const onPaginationChange = (val: number) => {
    const newPage = getValidCurrentPage(val);
    setInternalCurrentPage(newPage);
    onChange?.(newPage, internalPageSize);
  };

  const onPrev = () => {
    const newPage = getValidCurrentPage(internalCurrentPage - 1);
    setInternalCurrentPage(newPage);
    onChange?.(newPage, internalPageSize);
  };

  const onNext = () => {
    const newPage = getValidCurrentPage(internalCurrentPage + 1);
    setInternalCurrentPage(newPage);
    onChange?.(newPage, internalPageSize);
  };

  const onPageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setInternalPageSize(newSize);
    setInternalCurrentPage(1); // 🔹 yangi o‘lchamda 1-sahifadan boshlanadi
    onChange?.(1, newSize);
  };

  const pagerClass = {
    default: "pagination-pager",
    inactive: "pagination-pager-inactive",
    active: `text-primary dark:bg-primary dark:text-neutral`,
    disabled: "pagination-pager-disabled",
  };

  const paginationClass = classNames(
    "pagination",
    "flex justify-between",
    className
  );

  return (
    <div className={paginationClass}>
      {displayTotal && <Total total={total} />}

      {/* 🔹 Sahifa o‘lchami tanlash */}
      <div className="pagination">
        <div className="inline-flex items-center">
          <Prev
            currentPage={internalCurrentPage}
            pagerClass={pagerClass}
            onPrev={onPrev}
          />
          <Pager
            pageCount={getInternalPageCount as number}
            currentPage={internalCurrentPage}
            pagerClass={pagerClass}
            onChange={onPaginationChange}
          />
          <Next
            currentPage={internalCurrentPage}
            pageCount={getInternalPageCount as number}
            pagerClass={pagerClass}
            onNext={onNext}
          />
        </div>
        {showSizeOption && (
          <select
            value={internalPageSize}
            onChange={onPageSizeChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-[14px] mr-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {pageSizeOptions?.map((size) => (
              <option key={size} value={size}>
                {size} / страница
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

Pagination.displayName = "Pagination";

export default Pagination;

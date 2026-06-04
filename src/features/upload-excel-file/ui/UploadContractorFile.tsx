import { messages } from "@/app/constants/message.request";
import { createContractorApi, updateContractorApi } from "@/entities/auth/api";
import { useCreateProductWithExcel } from "@/entities/products/repository";
import { useContractorApi } from "@/entities/sale/repository";
import { convertFilesToBase64 } from "@/shared/lib/convertFilesToBase64";
import { exportToExcel } from "@/shared/lib/arrayToExcelConvert";
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
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import StatusBar from "@/widgets/ui/status-bar/StatusBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FaCloudDownloadAlt, FaRegEdit } from "react-icons/fa";
import { LiaHourglassEndSolid } from "react-icons/lia";
import { MdOutlineFileDownload } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

const contractorOptions = [
    { label: "Название", value: "name" },
    { label: "Контакты (через запятую)", value: "contacts" },
    { label: "Тип (Клиент / Поставщик)", value: "type" },
    { label: "Задолженность", value: "debt" },
];


const INITIAL_PAGINATION = { pageIndex: 1, pageSize: 10 };

interface StatusState {
    success: number;
    faild: number;
    total: number;
    totalData: number;
    status: boolean;
    cancelled: boolean;
    failures: any[];
}

const INITIAL_STATUS: StatusState = {
    success: 0,
    faild: 0,
    total: 0,
    totalData: 0,
    status: true,
    cancelled: false,
    failures: [],
};

function parseType(val: any): { is_customer: boolean; is_supplier: boolean } {
    const s = String(val ?? "").toLowerCase();
    const is_customer = s.includes("клиент");
    const is_supplier = s.includes("поставщик");
    return {
        is_customer: is_customer || (!is_customer && !is_supplier),
        is_supplier,
    };
}

function parseContacts(val: any): { type: number; value: string }[] {
    if (!val) return [];
    return String(val)
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.startsWith("998") && p.length >= 12)
        .map((p) => ({ type: 2, value: p.slice(0, 12) }));
}

function extractErrorMessage(err: any): string {
    // Axios: err.response.data, IPC: err.data yoki err o'zi
    const error = err?.response?.data ?? err?.data ?? err ?? {};

    if (error.name_already_exists || error.name_exist) {
        return "Контрагент с таким именем уже зарегистрирован";
    }
    if (error.not_found) {
        return "Контрагент не найден";
    }
    if (error.message) {
        return `Ошибка: ${error.message}`;
    }
    return err?.message ?? "Неизвестная ошибка";
}

const UploadContractorFile = ({ isOpen, setIsOpen }: any) => {
    const queryClient = useQueryClient();
    const { mutate: createWithExcel, isPending: loadingExcel } =
        useCreateProductWithExcel();
    const { data: contractorData } = useContractorApi(true, "");

    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [selectedSelect, setSelectedSelect] = useState<Record<number, string>>({});
    const [rowsCount, setRowsCount] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [pagination, setPagination] = useState(INITIAL_PAGINATION);
    const [loadData, setLoadData] = useState(false);
    const [status, setStatus] = useState<StatusState>(INITIAL_STATUS);
    const [openStatusBar, setOpenStatusBar] = useState(false);
    const [rowErrors, setRowErrors] = useState<(string | null)[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isCancelledRef = useRef(false);

    const clearFile = useCallback(() => {
        setSelectedSelect({});
        setData([]);
        setRowErrors([]);
        setFile(null);
        setRowsCount(1);
        setLoadData(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const onClose = useCallback(() => {
        setIsOpen(false);
        clearFile();
    }, [clearFile]);

    useEffect(() => {
        if (!isOpen) clearFile();
    }, [isOpen, clearFile]);

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
                        setLoadData(!!response?.length);
                        setData(response);
                        showSuccessMessage(
                            messages.uz.SUCCESS_MESSAGE,
                            messages.ru.SUCCESS_MESSAGE,
                        );
                    },
                    onError(err) {
                        showErrorMessage(err);
                    },
                },
            );
        },
        [createWithExcel],
    );

    const handleCloseBar = useCallback(() => {
        setOpenStatusBar(false);
        setStatus(INITIAL_STATUS);
    }, []);

    const handleCancel = useCallback(() => {
        isCancelledRef.current = true;
        setStatus((prev) => ({ ...prev, status: false, cancelled: true }));
        queryClient.invalidateQueries({ queryKey: ["contractor-all"] });
    }, [queryClient]);

    const downloadFailedExcel = () => {
        const remainingRows = data.slice(rowsCount);
        if (!remainingRows.length) {
            showErrorLocalMessage("Ошибочных данных нет");
            return;
        }
        const selectedCols = Object.keys(selectedSelect)
            .map(Number)
            .sort((a, b) => a - b);
        const headers = [
            ...selectedCols.map(
                (i) =>
                    contractorOptions.find((o) => o.value === selectedSelect[i])
                        ?.label ?? "",
            ),
            "Ошибка",
        ];
        const rows = remainingRows.map((row: any, i: number) => [
            ...selectedCols.map((col) => row[col] ?? ""),
            rowErrors[i] ?? "",
        ]);
        exportToExcel([headers, ...rows], "Ошибочные контрагенты");
        showSuccessMessage(messages.uz.SUCCESS_MESSAGE, messages.ru.SUCCESS_MESSAGE);
    };

    const uploadContractors = async () => {
        if (!Object.values(selectedSelect).includes("name")) {
            showErrorLocalMessage('Необходимо выбрать колонку для поля "Название"!');
            return;
        }

        const sourceData = data.slice(rowsCount);
        if (!sourceData.length) return;

        const mapped = sourceData.map((row) => {
            const obj: Record<string, any> = {};
            Object.entries(selectedSelect).forEach(([colIndex, fieldName]) => {
                const val = row[Number(colIndex)];
                obj[fieldName] = typeof val === "string" ? val.trim() : val;
            });
            return obj;
        });

        isCancelledRef.current = false;
        setOpenStatusBar(true);
        setStatus({ ...INITIAL_STATUS, totalData: mapped.length });

        let successCount = 0;
        let failCount = 0;
        const successIndices = new Set<number>();
        const errorByIndex = new Map<number, string>();

        const existingByName = new Map<string, any>(
            (contractorData as any[] | undefined)?.map((c) => [
                c.name?.trim(),
                c,
            ]) ?? [],
        );

        for (let i = 0; i < mapped.length; i++) {
            if (isCancelledRef.current) break;

            const elem = mapped[i];
            const name = String(elem.name ?? "").trim();
            if (!name) {
                failCount++;
                errorByIndex.set(i, "Название обязательно");
                setStatus((prev) => ({
                    ...prev,
                    faild: failCount,
                    total: successCount + failCount,
                }));
                continue;
            }

            const { is_customer, is_supplier } = parseType(elem.type);
            const contacts = parseContacts(elem.contacts);
            const debtRaw = elem.debt
                ? Number(String(elem.debt).replace(/,/g, ""))
                : 0;
            const debtAmount = isNaN(debtRaw) ? 0 : debtRaw;

            const payload = {
                name,
                is_customer,
                is_supplier,
                is_default: false,
                contacts,
                debt_state: { amount: debtAmount, currency_code: 860 },
            };

            try {
                if (editMode) {
                    const existing = existingByName.get(name);
                    if (!existing) {
                        throw Object.assign(new Error(), {
                            response: {
                                data: {
                                    error_code: "not_found",
                                },
                            },
                        });
                    }
                    await updateContractorApi(payload, existing.id);
                } else {
                    await createContractorApi(payload);
                }
                successCount++;
                successIndices.add(i);
                setStatus((prev) => ({
                    ...prev,
                    success: successCount,
                    total: successCount + failCount,
                }));
            } catch (err: any) {
                failCount++;
                errorByIndex.set(i, extractErrorMessage(err));
                setStatus((prev) => ({
                    ...prev,
                    faild: failCount,
                    total: successCount + failCount,
                }));
            }
        }

        const remainingRows = sourceData.filter((_, i) => !successIndices.has(i));
        const remainingErrors = sourceData
            .map((_, i) => errorByIndex.get(i) ?? null)
            .filter((_, i) => !successIndices.has(i));
        const headerRows = data.slice(0, rowsCount);
        setData([...headerRows, ...remainingRows]);
        setRowErrors(remainingErrors);

        queryClient.invalidateQueries({ queryKey: ["contractor-all"] });

        if (!isCancelledRef.current) {
            setStatus((prev) => ({ ...prev, status: false, cancelled: false }));
        }
    };

    const startIndex = (pagination.pageIndex - 1) * pagination.pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pagination.pageSize);
    const pageSizeOptions = [
        { label: "10 / Страница", value: 10 },
        { label: "25 / Страница", value: 25 },
        { label: "50 / Страница", value: 50 },
        { label: "100 / Страница", value: 100 },
    ];

    const hasFailures = rowErrors.some((e) => e !== null);

    return (
        <>
            <Dialog
                width={"100vw"}
                height={"90vh"}
                title={"Загрузить контрагентов из Excel"}
                isOpen={isOpen}
                onClose={onClose}
            >
                <div>
                    {!file ? (
                        <div className="relative border border-dashed border-slate-300 bg-slate-100 px-8 py-12 rounded-lg text-center mb-10">
                            <label
                                htmlFor="contractorFileInput"
                                className="cursor-pointer flex flex-col items-center text-slate-600"
                            >
                                <div className="flex items-center gap-x-2 mb-3">
                                    <span>
                                        <FaCloudDownloadAlt size={24} />
                                    </span>
                                    <span className="font-semibold text-lg">
                                        Выберите файл
                                    </span>
                                </div>
                                <span className="text-orange-600">
                                    Нажмите, чтобы загрузить файл
                                </span>
                                <input
                                    ref={fileInputRef}
                                    id="contractorFileInput"
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    ) : null}

                    {data.length > 0 && !loadingExcel ? (
                        <>
                            <div className="mb-5">
                                <div className="flex justify-between items-center mb-5 px-0.5">
                                    <h4 className="text-slate-700">
                                        Контрагенты{" "}
                                        <span className="bg-orange-400 text-orange-900 p-1 text-[16px] rounded">
                                            {data.length - rowsCount}
                                        </span>
                                    </h4>
                                    <label
                                        htmlFor="contractorEditMode"
                                        className="flex gap-x-2 items-center cursor-pointer hover:text-slate-600 font-semibold"
                                    >
                                        <Switcher
                                            id="contractorEditMode"
                                            defaultChecked={editMode}
                                            onChange={(checked: boolean) =>
                                                setEditMode(checked)
                                            }
                                        />
                                        <span>Редактировать</span>
                                    </label>
                                </div>
                                <div className="flex justify-between items-center mb-5 px-0.5">
                                    <InputGroup className="px-0.5 flex w-[350px]">
                                        <Button
                                            size="sm"
                                            className="z-10"
                                            onClick={() =>
                                                setRowsCount((p) => Math.max(0, p - 1))
                                            }
                                        >
                                            -
                                        </Button>
                                        <Input
                                            onChange={(e) => {
                                                const v = Number(e.target.value);
                                                setRowsCount(isNaN(v) ? 0 : v);
                                            }}
                                            size="sm"
                                            className="w-full text-center shadow-inner bg-white -mx-5"
                                            value={rowsCount}
                                        />
                                        <Button
                                            size="sm"
                                            className="z-10"
                                            onClick={() => setRowsCount((p) => p + 1)}
                                        >
                                            +
                                        </Button>
                                    </InputGroup>
                                    <div className="flex items-center gap-x-2">
                                        {hasFailures && (
                                            <Button
                                                onClick={downloadFailedExcel}
                                                className="bg-teal-500 hover:bg-teal-600"
                                                variant="solid"
                                                size="sm"
                                                icon={<MdOutlineFileDownload size={20} />}
                                            >
                                                Скачать неудачные
                                            </Button>
                                        )}
                                        {editMode ? (
                                            <Button
                                                onClick={uploadContractors}
                                                className="bg-orange-500 hover:bg-orange-600"
                                                icon={<FaRegEdit />}
                                                variant="solid"
                                                size="sm"
                                            >
                                                Редактировать
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={uploadContractors}
                                                variant="solid"
                                                size="sm"
                                                icon={<LiaHourglassEndSolid />}
                                            >
                                                Загрузить
                                            </Button>
                                        )}
                                        <Button
                                            icon={<BsFillTrashFill size={20} />}
                                            onClick={clearFile}
                                            variant="solid"
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-400"
                                        >
                                            Очистить
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    maxHeight: "calc(90vh - 270px)",
                                    overflowY: "auto",
                                    padding: "0 10px",
                                }}
                            >
                                <Table cellBorder={true} className="w-full table-fixed">
                                    <THead className="sticky top-0 z-10">
                                        <Tr>
                                            <Th className="w-max">№</Th>
                                            {data[0]?.map((_: any, index: number) => (
                                                <Th key={index} className="bg-white">
                                                    <div className="w-[250px]">
                                                        <Select
                                                            placeholder={"Выбрать"}
                                                            isSearchable={false}
                                                            options={contractorOptions.filter(
                                                                (opt) =>
                                                                    !Object.values(
                                                                        selectedSelect,
                                                                    ).includes(opt.value) ||
                                                                    selectedSelect[index] ===
                                                                        opt.value,
                                                            )}
                                                            value={
                                                                contractorOptions.find(
                                                                    (o) =>
                                                                        o.value ===
                                                                        selectedSelect[index],
                                                                ) || null
                                                            }
                                                            onChange={(option) =>
                                                                setSelectedSelect((prev) => ({
                                                                    ...prev,
                                                                    [index]: option?.value || "",
                                                                }))
                                                            }
                                                            isClearable
                                                            className="relative text-left w-full"
                                                            menuPortalTarget={document.body}
                                                            menuPosition="fixed"
                                                            styles={{
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                        />
                                                    </div>
                                                </Th>
                                            ))}
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {paginatedData.map(
                                            (elem: string[], index: number) => {
                                                const globalIndex = startIndex + index + 1;
                                                const highlight = rowsCount >= globalIndex;
                                                const dataRowIndex = globalIndex - rowsCount - 1;
                                                const errMsg =
                                                    dataRowIndex >= 0
                                                        ? rowErrors[dataRowIndex]
                                                        : null;
                                                return (
                                                    <Tr
                                                        key={`row-${globalIndex}`}
                                                        className={`h-14 ${
                                                            highlight
                                                                ? "bg-slate-200"
                                                                : errMsg
                                                                  ? "bg-red-50"
                                                                  : "bg-white"
                                                        }`}
                                                    >
                                                        <Td>
                                                            <div className="w-max px-3">
                                                                {globalIndex}
                                                            </div>
                                                        </Td>
                                                        {elem.map((item, i) => (
                                                            <Td key={i}>
                                                                <div className="w-[250px] px-3">
                                                                    {item}
                                                                </div>
                                                            </Td>
                                                        ))}
                                                        {errMsg && (
                                                            <Td>
                                                                <div className="px-3 text-red-500 text-xs whitespace-nowrap">
                                                                    {errMsg}
                                                                </div>
                                                            </Td>
                                                        )}
                                                    </Tr>
                                                );
                                            },
                                        )}
                                    </TBody>
                                </Table>
                                <div className="flex justify-between py-4">
                                    <Pagination
                                        total={data.length}
                                        pageSizeOptions={[10, 25, 50, 100]}
                                        currentPage={pagination.pageIndex}
                                        showSizeOption={false}
                                        pageSize={pagination.pageSize}
                                        onChange={(pageNumber: number) =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageIndex: pageNumber,
                                            }))
                                        }
                                    />
                                    <Select
                                        className="w-[180px] bg-transparent border-0"
                                        options={pageSizeOptions}
                                        isSearchable={false}
                                        value={pageSizeOptions.find(
                                            (o) => o.value === pagination.pageSize,
                                        )}
                                        size="sm"
                                        menuPlacement="top"
                                        onChange={(selected) =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageSize: selected?.value || 10,
                                                pageIndex: 1,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-20">
                            {loadingExcel ? <Loading /> : null}
                        </div>
                    )}
                </div>
                {!loadData && !loadingExcel && file ? (
                    <Empty
                        size={150}
                        textSize="22px"
                        text="Данные не найдены или формат файла некорректен"
                    />
                ) : null}
            </Dialog>
            <StatusBar
                handleCloseBar={handleCloseBar}
                handleCancel={handleCancel}
                openStatusBar={openStatusBar}
                status={status}
            />
        </>
    );
};

export default UploadContractorFile;

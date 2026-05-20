import { useEffect, useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    type ColumnDef,
} from "@tanstack/react-table";
import CreateAccount from "./CreateAccount";
import {
    useDeleteAccount,
    useUpdatePermission,
} from "@/entities/auth/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import { FaUserCheck } from "react-icons/fa";
import { Button, Checkbox, Dialog } from "@/shared/ui/kit";
import {
    AccountPermissions,
    PermissionGroups,
    PermissionLabels,
    type PermissionKey,
} from "@/app/constants/permissions";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { formattedPhone } from "@/shared/lib/formatedPhone";

type User = {
    id: string;
    name: string;
    username: string;
    type: 1 | 0;
};

const ROLE_STYLES: Record<User["type"], string> = {
    1: "bg-rose-100  text-rose-700  border border-rose-200",
    0: "bg-amber-100 text-amber-700 border border-amber-200",
};

const ROLE_LABELS: Record<User["type"], string> = {
    1: "Админ",
    0: "Пользователь",
};

const columnHelper = createColumnHelper<User>();

const AccountsSection = ({ users }: { users: User[] }) => {
    const [id, setId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPermission, setIsOpenPermission] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        [],
    );
    const [accountID, setAccountID] = useState<string | null>(null);

    const { permissionList } = useSettingsStore();
    const { i18n } = useTranslation();
    const lang = i18n.language as "uz" | "ru";
    const { mutate } = useUpdatePermission();

    const { mutate: deleteMutate, isPending } = useDeleteAccount();

    const handleChange = (value: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(value)
                ? prev.filter((p) => p !== value)
                : [...prev, value],
        );
    };

    const onSubmitPermission = () => {
        if (!accountID) return;

        const payload = {
            account_id: accountID,
            permissions: selectedPermissions,
        };

        mutate(payload, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                setIsOpenPermission(false);
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    // 🔥 SELECT ALL
    const allPermissions = Object.values(AccountPermissions);

    const isAllSelected = allPermissions.length === selectedPermissions.length;

    const toggleAll = () => {
        if (isAllSelected) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(allPermissions);
        }
    };

    const handleDelete = () => {
        if (!id) return;
        deleteMutate(id, {
            onSuccess() {
                setIsOpen(false);
                setId(null);
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    

    const columns = useMemo<ColumnDef<User, any>[]>(
        () => [
            columnHelper.accessor("name", {
                header: "Имя",
                cell: (info) => (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {info.getValue().charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                            {info.getValue()}
                        </span>
                    </div>
                ),
            }),
            columnHelper.accessor("username", {
                header: "номер пользователя",
                cell: (info) => (
                    <span className="font-mono text-sm text-gray-500">
                        {formattedPhone(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor("type", {
                header: "Роль",
                cell: (info) => {
                    const val = info.getValue() ?? 0; // ← undefined bo'lsa 0 ga fallback
                    return (
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                ROLE_STYLES[val as User["type"]] ?? ""
                            }`}
                        >
                            {ROLE_LABELS[val as User["type"]] ?? "—"}
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: "action",
                header: "Действие",
                cell: ({ row }) => {
                    return (
                        <div className="flex gap-x-2">
                            {row.original.type !== 1 && (
                                <Button
                                    onClick={() => {
                                        setId(row.original.id);
                                        setIsOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-150"
                                    icon={
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14H6L5 6" />
                                                <path d="M10 11v6M14 11v6" />
                                                <path d="M9 6V4h6v2" />
                                            </svg>
                                        </>
                                    }
                                />
                            )}

                            {row.original.type !== 1 && (
                                <Button
                                    onClick={() => {
                                        setIsOpenPermission(true);
                                        setAccountID(row?.original?.id);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-150"
                                    icon={<FaUserCheck />}
                                />
                            )}
                        </div>
                    );
                },
            }),
        ],
        [],
    );

    useEffect(() => {
        if (permissionList?.length > 0) {
            setSelectedPermissions(permissionList);
        }
    }, [permissionList]);

    const table = useReactTable({
        data: users ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-6">
            <div className="mb-5 flex justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Список пользователей
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {users?.length ?? 0} пользователей
                    </p>
                </div>
                <>
                    <CreateAccount />
                </>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns?.length}
                                    className="text-center py-12 text-gray-400"
                                >
                                    Пользователь не найден
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row, idx) => (
                                <tr
                                    key={row.id}
                                    className={`border-b border-gray-100 last:border-0 transition-all duration-300 
                                        // deletingId === row.original.id
                                        //     ? "opacity-0 scale-95"
                                        //     : "hover:bg-gray-50"
                                    ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-5 py-3.5"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title="Вы уверены, что хотите удалить этого пользователя?"
                isOpen={isOpen}
                confirmButtonProps={{
                    loading: isPending,
                    onClick: handleDelete,
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={() => {
                    setIsOpen(false);
                    setId(null);
                }}
                onRequestClose={() => {
                    setIsOpen(false);
                    setId(null);
                }}
                onCancel={() => {
                    setIsOpen(false);
                    setId(null);
                }}
            >
                <p className="text-gray-600">
                    После удаления восстановить пользователя будет невозможно.
                </p>
            </ConfirmDialog>

            {/* PERMISSION */}
            <Dialog
                portalClassName="w-full"
                closable={false}
                width={"80vw"}
                height={"90vh"}
                title={"Управление разрешениями"}
                isOpen={isOpenPermission}
            >
                <div className="flex gap-x-2 justify-between mb-5">
                    <label className="flex items-center gap-x-2 text-slate-800">
                        <Checkbox
                            checked={isAllSelected}
                            onChange={toggleAll}
                        />
                        <span>Выбрать все</span>
                    </label>
                    <div className="flex gap-x-2 items-center">
                        <Button
                            size="sm"
                            onClick={() => setIsOpenPermission(false)}
                        >
                            Закрыть
                        </Button>

                        <Button
                            variant="solid"
                            size="sm"
                            loading={isPending}
                            onClick={onSubmitPermission}
                        >
                            Сохранить
                        </Button>
                    </div>
                </div>
                <div className="h-[66vh] overflow-y-auto mb-5 text-slate-700">
                    <div className="flex flex-col gap-y-5">
                        {PermissionGroups[lang].map((group) => (
                            <div key={group.label}>
                                {/* Bo'lim sarlavhasi */}
                                <h4 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide mb-2 border-b pb-1">
                                    {group.label}
                                </h4>

                                {/* Bo'lim permissionlari */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {(
                                        group.keys as readonly PermissionKey[]
                                    ).map((key) => {
                                        const value = AccountPermissions[key];
                                        return (
                                            <label
                                                className="flex items-center gap-x-2 text-slate-700 text-[14px]"
                                                key={value}
                                            >
                                                <Checkbox
                                                    checked={selectedPermissions.includes(
                                                        value,
                                                    )}
                                                    onChange={() =>
                                                        handleChange(value)
                                                    }
                                                />
                                                <span>
                                                    {
                                                        PermissionLabels[lang][
                                                            key
                                                        ]
                                                    }
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AccountsSection;

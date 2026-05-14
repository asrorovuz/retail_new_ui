import { useAuthContext } from "@/app/providers/AuthProvider";
import { useGetAllAcounts } from "@/entities/auth/repository";
import { AccountsSections } from "@/features/account";
import ChangePassowdModal from "@/features/account/ui/ChangePassowdModal";
import { formattedPhone } from "@/shared/lib/formatedPhone";
import { getRole } from "@/shared/lib/getRole";
import { Button, Dialog } from "@/shared/ui/kit";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import { useState } from "react";
import { FaUserTie } from "react-icons/fa";

const AccountPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useAuthContext();
    const { data: allUser } = useGetAllAcounts();

    const onClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                {/* Header */}
                <div className="mb-2">
                    <NavigateButton content="Аккаунт" />
                </div>

                {/* Card */}
                <div className="flex items-center gap-6 border rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                    {/* Avatar */}
                    <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full">
                        <FaUserTie size={40} className="text-gray-600" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-end pb-2">
                                <Button
                                    onClick={() => setIsOpen(true)}
                                    size="sm"
                                >
                                    Изменить пароль
                                </Button>
                            </li>
                            <li className="flex justify-between border-b pb-1">
                                <span className="text-gray-500">Ф.И.О:</span>
                                <span className="font-medium text-gray-800">
                                    {user?.name || "-"}
                                </span>
                            </li>

                            <li className="flex justify-between border-b pb-1">
                                <span className="text-gray-500">
                                    Имя пользователя:
                                </span>
                                <span className="font-medium text-gray-800">
                                    {formattedPhone(user?.username || "-")}
                                </span>
                            </li>

                            <li className="flex justify-between">
                                <span className="text-gray-500">Роль:</span>
                                <span className="font-semibold text-blue-600">
                                    {getRole(user?.type)}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Dialog width={"50vw"} isOpen={isOpen} closable={false}>
                    <ChangePassowdModal onClose={onClose} id={user?.id} />
                </Dialog>
            </div>
            {user?.type === 1 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm flex-1 h-full overflow-y-auto">
                    <AccountsSections users={allUser} />
                </div>
            )}
        </div>
    );
};

export default AccountPage;

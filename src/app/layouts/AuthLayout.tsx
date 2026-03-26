import { Outlet, useNavigate } from "react-router";
import logoHippo from "@/app/assets/image.png";
import { useAuthStatus } from "@/entities/auth/repository";
import { useEffect } from "react";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";

export const AuthLayout = () => {
    const navigate = useNavigate();

    const { data, refetch } = useAuthStatus();

    useEffect(() => {
        if (data?.is_registered) navigate("/login");
        else navigate("/register");
    }, [data]);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-200">
            <div className="grid grid-cols-2 w-[80vw] justify-center bg-white rounded-xl">
                <div className="flex items-center justify-center flex-col">
                    <div className="w-[250px] mb-6 bg-white">
                        <img
                            className="w-full object-cover"
                            src={logoHippo}
                            alt="Hippo"
                        />
                    </div>
                    <h3 className="font-bold text-xl mb-6 !text-gray-700">
                        Добро пожаловать
                    </h3>
                </div>
                <div>
                    <Outlet
                        context={{
                            refetch,
                            isRegistered: data?.is_registered ?? false,
                        }}
                    />
                </div>
            </div>
            <FullKeyboard />
        </div>
    );
};

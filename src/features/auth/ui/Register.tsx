import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Step1Phone from "./Step1";
import Step2Info from "./Step2";
import Step3Confirm from "./Step3";
import { Button, Dialog, Form, Spinner, Steps } from "@/shared/ui/kit";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    useConfirmCode,
    useRegisteration,
    useRegisterOrgLocal,
} from "@/entities/auth/repository";
import { showErrorMessage } from "@/shared/lib/showMessage";

type OutletContextType = {
    refetch: any;
    isRegistered: boolean;
};

const Register = () => {
    const navigate = useNavigate();
    const timeoutRef = useRef<any | null>(null);

    const [isError, setIsError] = useState<boolean>(false);
    const [code, setCode] = useState("");
    const [isOpenCode, setIsOpenCode] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [step, setStep] = useState(1);

    const { refetch } = useOutletContext<OutletContextType>() || {
        refetch: () => {},
    };
    const { mutate: confirmCode, isPending } = useConfirmCode();
    const { mutate: registerationMutate, isPending: regesPending } =
        useRegisteration();
    const { mutate: registerOrgLocalMutate, isPending: localOrgPending } =
        useRegisterOrgLocal();

    const form = useForm({
        defaultValues: {
            name: "",
            username: "",
            password: "",
            referral_agent_code: "",
            region_code: null,
            district_code: null,
            confirm_ticket: "",
            confirm_code: "",
            organization: null,
        },
    });

    const onErrors = (err: any) => {
        setIsError(true);
        showErrorMessage(err);
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => {
        if (step === 2) {
            setStep((s) => s - 1);
        }

        if (step === 3) {
            setStep((s) => s - 1);
        }
    };

    // 1️⃣ Step 1 form submit – faqat confirmCode chaqiriladi, modal ochiladi
    const onSubmitStep1 = (values: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(
            () => onErrors({ error_timeout: true }),
            90_000,
        );

        confirmCode(values?.username, {
            onSuccess(res: any) {
                setResponse({
                    ...values,
                    confirm_ticket: res?.confirm_ticket, // save confirm_ticket for later
                });
                setIsOpenCode(true); // 🔥 modalni ochish
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    // 2️⃣ Modal submit – faqat registeration chaqiriladi
    const onSubmitCode = () => {
        if (!response) return;

        registerationMutate(
            {
                ...response,
                confirm_code: code,
            },
            {
                onSuccess(res) {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                    setResponse(res);
                    setIsOpenCode(false);
                    nextStep(); // Step 2 ga o'tadi
                },
                onError(err) {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                    onErrors(err);
                },
            },
        );
    };

    // 3️⃣ Form onSubmit – stepga qarab ajratilgan
    const onSubmit = (values: any) => {
        if (step === 1) {
            onSubmitStep1(values); // Step 1 form submit
        }

        if (step === 2) {
            registerOrgLocalMutate(
                {
                    ...values?.organization,
                    owner_account_id: response?.id,
                },
                {
                    onSuccess() {
                        nextStep(); // Step 3 ga o'tadi
                    },
                    onError(err) {
                        onErrors(err);
                    },
                },
            );
        }

        if (step === 3) {
            refetch();
            navigate("/login");
        }
    };

    return (
        <div className="w-full max-w-lg bg-white rounded-lg p-6">
            <Steps
                current={step}
                className="mb-4"
                status={
                    isPending ? "pending" : isError ? "error" : "in-progress"
                }
            >
                <Steps.Item
                    title="Hippo.uz"
                    customIcon={
                        (step === 0 && isPending) || regesPending ? (
                            <Spinner />
                        ) : (
                            ""
                        )
                    }
                />
                <Steps.Item
                    title="Register"
                    customIcon={step === 2 && regesPending ? <Spinner /> : ""}
                />
                <Steps.Item title="Finish" />
            </Steps>

            <FormProvider {...form}>
                <Form layout="vertical" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="max-h-[36vh] overflow-x-auto">
                        {step === 1 && <Step1Phone />}
                        {step === 2 && (
                            <Step2Info
                                response={response}
                                item={response ? response?.organizations : []}
                                nextStep={nextStep}
                            />
                        )}
                        {step === 3 && <Step3Confirm />}
                    </div>

                    <div className="flex justify-between mt-6">
                        <Button
                            type="button"
                            className="text-gray-700 font-medium rounded-xl"
                            onClick={prevStep}
                        >
                            Назад
                        </Button>

                        <Button
                            onClick={() => {
                                (refetch(), navigate("/login"));
                            }}
                            type="button"
                            variant="solid"
                            className="bg-transparent hover:bg-transparent text-gray-700 font-medium rounded-xl"
                        >
                            Выйти
                        </Button>

                        {step < 3 ? (
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isPending || localOrgPending}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl"
                            >
                                Далее
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="solid"
                                className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl"
                            >
                                Готова
                            </Button>
                        )}
                    </div>
                </Form>
            </FormProvider>
            <Dialog
                width={"380px"}
                isOpen={isOpenCode}
                onClose={() => setIsOpenCode(false)}
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                        Введите SMS-код
                    </h3>

                    <div className="flex justify-center gap-2 mb-6">
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={code[index] || ""}
                                onChange={(e) => {
                                    const val = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    if (!val) return;

                                    const newCode =
                                        code.substring(0, index) +
                                        val +
                                        code.substring(index + 1);

                                    setCode(newCode);

                                    const next = e.target
                                        .nextSibling as HTMLInputElement;
                                    if (next) next.focus();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Backspace") {
                                        const newCode =
                                            code.substring(0, index) +
                                            code.substring(index + 1);
                                        setCode(newCode);

                                        const prev = e.currentTarget
                                            .previousSibling as HTMLInputElement;
                                        if (prev) prev.focus();
                                    }
                                }}
                                className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="solid"
                        loading={regesPending}
                        disabled={code.length !== 6}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        onClick={onSubmitCode}
                    >
                        Подтвердить
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default Register;

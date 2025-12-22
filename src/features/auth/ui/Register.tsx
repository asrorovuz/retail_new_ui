import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Step1Phone from "./Step1";
import Step2Info from "./Step2";
import Step3Confirm from "./Step3";
import { Button, Form, Spinner, Steps } from "@/shared/ui/kit";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useGlobalLogin, useRegister } from "@/entities/auth/repository";
import { showErrorMessage } from "@/shared/lib/showMessage";
import type { Organizationtype } from "@/@types/auth/login";

type OutletContextType = {
  refetch: any;
  isRegistered: boolean;
};

const Register = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const { refetch } = useOutletContext<OutletContextType>() || { refetch: () => {} };
  const { mutate: globalLogin, isPending: globalLoginPending } =
    useGlobalLogin();
  const { mutate: register, isPending: registerLoading } = useRegister();
  const [response, setResponse] = useState<Organizationtype | null>(null);
  const [step, setStep] = useState(1);
  const form = useForm({
    defaultValues: {
      login: "",
      pass: "",
      organization_id: "",
      username: "",
      password: "",
      name: "",
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

  const onSubmit = (values: any) => {
    if (step === 1) {
      globalLogin(
        { username: values?.login, password: values?.pass },
        {
          onSuccess(res) {
            setResponse(res);
            nextStep();
          },
          onError(err) {
            onErrors(err);
          },
        }
      );
    }

    if (step === 2) {
      register(
        { ...values, token: response?.token },
        {
          onSuccess() {
            nextStep();
          },
          onError(err) {
            onErrors(err);
          },
        }
      );
    }

    if (step === 3) {
      refetch()
      navigate("/login");
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-bold text-2xl mb-6 text-gray-700! border-t-4 border-blue-500 pt-4">
        Добро пожаловать
      </h3>

      <Steps
        current={step}
        className="mb-4"
        status={
          globalLoginPending ? "pending" : isError ? "error" : "in-progress"
        }
      >
        <Steps.Item
          title="Hippo.uz"
          customIcon={
            (step === 0 && globalLoginPending) || registerLoading ? (
              <Spinner />
            ) : (
              ""
            )
          }
        />
        <Steps.Item
          title="Register"
          customIcon={step === 2 && registerLoading ? <Spinner /> : ""}
        />
        <Steps.Item title="Finish" />
      </Steps>

      <FormProvider {...form}>
        <Form
          className="max-h-[50vh] overflow-x-auto"
          layout="vertical"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {step === 1 && <Step1Phone />}
          {step === 2 && (
            <Step2Info item={response ? response?.organizations : []} />
          )}
          {step === 3 && <Step3Confirm />}

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              className="text-gray-700 font-medium rounded-xl"
              onClick={prevStep}
            >
              Назад
            </Button>

            <Button
              onClick={() => navigate("/login")}
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
                loading={globalLoginPending || registerLoading}
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
    </div>
  );
};

export default Register;

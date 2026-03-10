import { Controller, useFormContext } from "react-hook-form";
import { Button, Dialog, FormItem, Input, Select } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import { useRegisterOrg } from "@/entities/auth/repository";
import { storeTypeOptions } from "../options";

const Step2 = ({
  item,
  response,
  nextStep,
}: {
  item: any[];
  response: any;
  nextStep: any;
}) => {
  const { control } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<number | null>(null);
  const [newOrgName, setNewOrgName] = useState("");

  const { mutate: registerOrgMutate, isPending: regOrgPending } =
    useRegisterOrg();

  const onClose = () => {
    setIsOpen(false);
    setType(null);
    setNewOrgName("");
  };

  const createOrg = () => {
    registerOrgMutate(
      {
        name: newOrgName,
        owner_account_id: response?.id,
        referral_agent_code: response?.referral_agent_code,
        store_type: type,
      },
      {
        onSuccess() {
          nextStep();
        },
      },
    );
  };

  useEffect(() => {
    if (!item || item.length === 0) {
      setIsOpen(true);
    }
  }, [item]);

  return (
    <>
      {/* Organization */}
      <Controller
        name="organization"
        control={control}
        rules={{ required: "Выберите организацию" }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Организация"
            invalid={!!fieldState?.error}
            errorMessage={fieldState?.error?.message}
          >
            <Select
              {...field}
              options={item || []}
              getOptionLabel={(option) => option?.name}
              // value={item?.find((i) => i?.id === field?.value) || null}
              placeholder="Введите название организации."
              onChange={(opt) => field.onChange(opt)}
            />
          </FormItem>
        )}
      />

      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full"
        variant="solid"
      >
        + Создать организацию
      </Button>

      <Dialog
        width={"60vw"}
        title={"Создать организацию"}
        onClose={onClose}
        isOpen={isOpen}
      >
        <FormItem label="Название организации" asterisk>
          <Input
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="Введите название организации"
          />
        </FormItem>
        <FormItem label="Организация">
          <Select
            options={storeTypeOptions}
            placeholder="Введите название организации."
            value={storeTypeOptions.find((o) => o.value === type) || null}
            onChange={(opt) => setType(opt?.value || null)}
          />
        </FormItem>
        <Button
          type="button"
          onClick={createOrg}
          loading={regOrgPending}
          className="w-full"
          variant="solid"
          disabled={!newOrgName}
        >
          Сохранить
        </Button>
      </Dialog>
    </>
  );
};

export default Step2;

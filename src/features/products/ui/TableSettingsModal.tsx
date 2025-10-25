import type { ProductColumnVisibility } from "@/@types/products";
import { messages } from "@/app/constants/message.request";
import { colors } from "@/app/constants/settings.constants";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useUpdateTableSettings } from "@/entities/products/repository";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { convertArrayToBackendSettings } from "@/shared/lib/transformation-table";
import { Button, Dialog, Select, Switcher } from "@/shared/ui/kit";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";

const TableSettingsModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempHiddenColumns, setTempHiddenColumns] = useState<any[]>([]);

  const { setTableSettings, tableSettings } = useSettingsStore(
    (store) => store
  );
  const updateTableSettingsMutation = useUpdateTableSettings();

  const toggleOpen = () => {
    const merged = tableSettings?.map((col) => {
      const existing = tableSettings.find((h) => h?.key === col?.key);
      return {
        key: col?.key,
        color: existing ? existing?.color : col?.defaultColor || null,
        visible: existing ? existing?.visible : col?.visible ?? true,
      };
    });
    setTempHiddenColumns(merged);
    setIsOpen(true);
  };

  const changeVisibleColumns = (column: string) => {
    let newHiddenColumns = tempHiddenColumns.map((i) =>
      i.key === column ? { ...i, visible: !i.visible } : i
    );
    setTempHiddenColumns(newHiddenColumns);
  };

  const changeColor = (column: string, color: string) => {
    let newHiddenColumns = tempHiddenColumns.map((i) =>
      i.key === column ? { ...i, color: color || null } : i
    );
    setTempHiddenColumns(newHiddenColumns);
  };

  const handleCancel = () => {
    setTempHiddenColumns(tableSettings);
    setIsOpen(false);
  };

  const handleSave = () => {
    const result = convertArrayToBackendSettings(
      tempHiddenColumns
    ) as ProductColumnVisibility;

    updateTableSettingsMutation.mutate(result, {
      onSuccess: () => {
        showSuccessMessage(
          messages.uz.SUCCESS_MESSAGE,
          messages.ru.SUCCESS_MESSAGE
        );
        setTableSettings(tempHiddenColumns);
        setIsOpen(false);
      },
      onError: (error) => {
        showErrorMessage(error);
      },
    });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button
        variant="plain"
        icon={<FiSettings />}
        className="bg-white"
        onClick={toggleOpen}
      />

      <Dialog
        title={t("Настройки")}
        isOpen={isOpen}
        closable={true}
        onClose={onClose}
        onRequestClose={onClose}
        bodyOpenClassName="overflow-hidden"
        width={490}
      >
        <div className="flex flex-col gap-y-3 mb-5">
          {tableSettings?.map((i) => (
            <React.Fragment key={i.key}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xl">
                  {t(`tableSettings.${i.key}`)}
                </span>
                <div className="flex items-center justify-end">
                  <Switcher
                    checked={
                      tempHiddenColumns.find((j) => j.key === i.key)?.visible ??
                      false
                    }
                    onChange={() => changeVisibleColumns(i.key)}
                  />
                  <Select
                    className={classNames(`w-[200px] ml-2`)}
                    options={colors}
                    isClearable
                    onChange={(option) =>
                      changeColor(i.key, option?.name || "")
                    }
                    value={
                      colors?.find(
                        (j) =>
                          j.name ===
                          tempHiddenColumns.find((l) => l.key === i.key)?.color
                      ) || null
                    }
                    // hideDropdownIndicator={true}
                    getOptionLabel={(option) => t(`colors.${option?.name}`)}
                    getOptionValue={(option) => option?.name}
                    placeholder={t("color")}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* 🔹 Pastki tugmalar */}
        <div className="flex justify-end gap-x-3">
          <Button variant="plain" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
          <Button variant="solid" onClick={handleSave}>
            {t("common.save")}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default TableSettingsModal;

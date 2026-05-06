import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useCallback } from "react";

export const useCheckPermission = () => {
  const permissionList = useSettingsStore((s) => s.permissionList);

  const checkPermission = useCallback(
    (permission: number) => {
      return permissionList?.includes(permission);
    },
    [permissionList]
  );

  return checkPermission;
};
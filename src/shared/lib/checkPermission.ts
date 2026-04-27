import { useSettingsStore } from "@/app/store/useSettingsStore";

export const checkPermission = (permission: number) => {
    const permissionList = useSettingsStore.getState().permissionList;
    return permissionList?.includes(permission);
};

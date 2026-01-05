import { measurment } from "@/app/constants/measurment.constants";

export const showMeasurmentName = (code: number): string | null => measurment?.[code] ?? null;

import { measurment } from "@/app/constants/measurment.constants";

export const showMeasurmentName = (name: number): string | null => measurment?.[name] ?? null;

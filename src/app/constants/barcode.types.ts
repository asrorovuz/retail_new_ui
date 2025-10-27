export interface BarcodeType {
  label: string;
  value: string;
}

export const barcodeTypes: BarcodeType[] = [
    { value: 'CODE39', label: 'CODE39' },
    { value: 'CODE128', label: 'CODE128 auto' },
    { value: 'CODE128A', label: 'CODE128 A' },
    { value: 'CODE128B', label: 'CODE128 B' },
    { value: 'CODE128C', label: 'CODE128 C' },
    { value: 'EAN13', label: 'EAN13' },
    { value: 'EAN8', label: 'EAN 8' },
    { value: 'EAN5', label: 'EAN 5' },
    { value: 'EAN2', label: 'EAN 2' },
    { value: 'EAN2', label: 'EAN 2' },
    { value: 'UPC', label: 'UPC' },
    { value: 'ITF14', label: 'ITF14' },
    { value: 'ITF', label: 'ITF' },
    { value: 'MSI', label: 'MSI' },
    { value: 'MSI10', label: 'MSI 10' },
    { value: 'MSI11', label: 'MSI 11' },
    { value: 'msi1110', label: 'MSI 1110' },
    { value: 'MSI1010', label: 'MSI 1010' },
    { value: 'MSI1110', label: 'MSI 1110' },
    { value: 'pharmacode', label: 'Pharma code' },
    { value: 'codabar', label: 'Coda bar' },
]
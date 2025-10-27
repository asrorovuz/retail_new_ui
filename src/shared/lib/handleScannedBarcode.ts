export const handleBarcodeScanned = (barcode: string): string => {
  let realBarcode = "";

  if (barcode.length > 14) {
    if (barcode.startsWith("010")) {
      // water
      realBarcode = barcode.slice(3, 16);
    } else if (barcode.startsWith("000")) {
      // smoke
      realBarcode = barcode.slice(3, 14);
    } else if (barcode.startsWith("0")) {
      realBarcode = barcode.slice(1, 14);
    }

    realBarcode = realBarcode.replace(/^0+|$/g, "");
  } else {
    realBarcode = barcode;
  }

  return realBarcode;
};

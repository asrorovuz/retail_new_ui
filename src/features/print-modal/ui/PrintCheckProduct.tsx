import type { Currency, Product } from "@/@types/products";
import {
  Button,
  Dialog,
  Input,
  InputGroup,
  Select,
  Switcher,
} from "@/shared/ui/kit";
import { RangeSlider } from "@/shared/ui/kit-pro";
import Barcode from "@/shared/ui/kit-pro/barcode/Barcode";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import SelectItemBarcodeType from "@/shared/ui/kit-pro/select-item-barcode/SelectItemBarcodeType";
import Addon from "@/shared/ui/kit/InputGroup/Addon";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPrint } from "react-icons/fa";
import printJS from "print-js";

type PropsType = {
  item: Product | null;
  type: "print" | "edit" | "add";
  onClosePrintModal: () => void;
};

const PrintCheckProduct = ({ item, type, onClosePrintModal }: PropsType) => {
  const { t } = useTranslation();

  const viewTypes = [
    {
      value: 1,
      label: t("штрих-код, названия, цена"),
    },
    {
      value: 2,
      label: t("цена, названия, штрих-код"),
    },
  ];

  const [barcode, setBarcode] = useState("12345670");
  const [barcodeType, setBarcodeType] = useState<{ value: string } | null>(
    null
  );
  const [isValid, setIsValid] = useState(false);
  const [itemCurrency, setItemCurrency] = useState<Currency | null>(null);
  const [viewItemName, setViewItemName] = useState(true);
  const [viewItemPrice, setViewItemPrice] = useState(true);
  const [viewNowDateTime, setViewNowDateTime] = useState(false);
  const [viewItemSku, setViewItemSku] = useState(false);
  const [selectedViewType, setSelectedViewType] = useState<{
    value: number;
    label: string;
  }>(viewTypes[0]);
  const [priceAmount, setPriceAmount] = useState("");
  const [barcodeMarginBottom, setBarcodeMarginBottom] = useState(1);
  const [barcodeWidth, setBarcodeWidth] = useState(2);
  const [viewBarcode, setViewBarcode] = useState(true);
  const [barcodeHeight, setBarcodeHeight] = useState(35);
  const [barcodeFontSize, setBarcodeFontSize] = useState(10);
  const [itemPriceFontSize, setItemPriceFontSize] = useState(20);
  const [itemSmallPriceFontSize, setItemSmallPriceFontSize] = useState(30);
  const [itemNameFontSize, setItemNameFontSize] = useState(22);
  const [itemNameAndPriceWidth, setItemNameAndPriceWidth] = useState(180);
  const [itemSkuFontSize, setItemSkuFontSize] = useState(25);

  const onClose = () => {
    setBarcode("12345670");
    onClosePrintModal();
  };

  const options = useMemo(
    () => ({
      format: barcodeType ? barcodeType.value : "EAN13",
      width: barcodeWidth,
      height: barcodeHeight,
      marginBottom: barcodeMarginBottom,
      fontSize: barcodeFontSize,
      valid: function (val: any) {
        setIsValid(val);
      },
    }),
    [
      barcodeType,
      barcodeWidth,
      barcodeHeight,
      barcodeMarginBottom,
      barcodeFontSize,
    ]
  );

  const onPrint = () => {
    const container = document.getElementById("printBarcode");
    if (!container) return;

    // Берём внутренности контейнера (включая уже сгенерированный SVG штрихкода)
    const content = container.innerHTML || "";

    // Собираем чистый HTML для печати — здесь задаём @page и базовые inline-стили
    const html = `
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          @page { margin: 0 !important; }
          html, body { margin: 0 !important; padding: 0 !important; }
          body { -webkit-print-color-adjust: exact; -webkit-font-smoothing: antialiased; font-family: Arial, sans-serif; }
          #printBarcode { margin: 0 !important; padding: 0 !important; text-align: center; }
          /* минимальные классы-заменители (если потребуется) */
          .barcode-wrapper { margin: 0 auto; display: block; }
          .item-name { font-weight: 700; line-height: 1; }
          .item-price { font-weight: 700; line-height: 1; }
        </style>
      </head>
      <body style="margin:0;padding:0;font-family:Arial, sans-serif;">
        <div id="printBarcode" style="margin:0;padding:0;text-align:center;">
          ${content}
        </div>
      </body>
    </html>
  `;

    // Небольшая задержка даёт браузеру время корректно сериализовать SVG/шрифты
    setTimeout(() => {
      printJS({
        printable: html,
        type: "raw-html",
        scanStyles: false,
      });
    }, 80);

    // Сохраняем настройки
    localStorage.setItem(
      "barcodeSettings",
      JSON.stringify({
        barcodeType: barcodeType,
        barcodeWidth: barcodeWidth,
        barcodeHeight: barcodeHeight,
        barcodeMarginBottom: barcodeMarginBottom,
        barcodeFontSize: barcodeFontSize,
        viewItemName: viewItemName,
        viewItemPrice: viewItemPrice,
        itemNameFontSize: itemNameFontSize,
        itemPriceFontSize: itemPriceFontSize,
        itemSmallPriceFontSize: itemSmallPriceFontSize,
        itemNameAndPriceWidth: itemNameAndPriceWidth,
        viewNowDateTime: viewNowDateTime,
        viewItemSku: viewItemSku,
        viewBarcode: viewBarcode,
        itemSkuFontSize: itemSkuFontSize,
        selectedViewType: selectedViewType,
      })
    );
  };

  useEffect(() => {
    const defaultBarcode = item?.barcodes?.[0]?.value || "12345670";
    const defaultPrice =
      item?.prices?.find((p) => p.product_price_type?.is_primary)?.amount || 0;
    const defaultCurrency =
      item?.prices?.find((p) => p.product_price_type?.is_primary)?.currency ||
      null;

    setBarcode(defaultBarcode);
    setPriceAmount(defaultPrice.toString());
    setItemCurrency(defaultCurrency);
  }, [item]);

  useEffect(() => {
    if (localStorage.getItem("barcodeSettings")) {
      let barcodeSettings = JSON.parse(
        localStorage.getItem("barcodeSettings")!
      );

      if (barcodeSettings.barcodeType)
        setBarcodeType(barcodeSettings.barcodeType);
      if (barcodeSettings.barcodeWidth)
        setBarcodeWidth(barcodeSettings.barcodeWidth);
      if (barcodeSettings.barcodeHeight)
        setBarcodeHeight(barcodeSettings.barcodeHeight);
      if (barcodeSettings.barcodeMarginBottom)
        setBarcodeMarginBottom(barcodeSettings.barcodeMarginBottom);
      if (barcodeSettings.itemNameFontSize)
        setItemNameFontSize(barcodeSettings.itemNameFontSize);
      if (barcodeSettings.barcodeFontSize)
        setBarcodeFontSize(barcodeSettings.barcodeFontSize);
      if (barcodeSettings.viewItemSku)
        setViewItemSku(barcodeSettings.viewItemSku);
      if (barcodeSettings.viewBarcode)
        setViewBarcode(barcodeSettings.viewBarcode);
      if (barcodeSettings.itemSkuFontSize)
        setItemSkuFontSize(barcodeSettings.itemSkuFontSize);

      if (typeof barcodeSettings.viewItemName !== "undefined")
        setViewItemName(barcodeSettings.viewItemName);

      if (typeof barcodeSettings.viewItemPrice !== "undefined")
        setViewItemPrice(barcodeSettings.viewItemPrice);

      if (barcodeSettings.itemNameFontSize)
        setItemNameFontSize(barcodeSettings.itemNameFontSize);

      if (barcodeSettings.itemPriceFontSize)
        setItemPriceFontSize(barcodeSettings.itemPriceFontSize);

      if (barcodeSettings.itemSmallPriceFontSize)
        setItemSmallPriceFontSize(barcodeSettings.itemSmallPriceFontSize);

      if (barcodeSettings.itemNameAndPriceWidth)
        setItemNameAndPriceWidth(barcodeSettings.itemNameAndPriceWidth);

      if (typeof barcodeSettings.viewNowDateTime !== "undefined")
        setViewNowDateTime(barcodeSettings.viewNowDateTime);

      if (typeof barcodeSettings.viewItemSku !== "undefined")
        setViewItemSku(barcodeSettings.viewItemSku);

      if (typeof barcodeSettings.viewBarcode !== "undefined")
        setViewBarcode(barcodeSettings.viewBarcode);

      if (barcodeSettings.itemSkuFontSize)
        setItemSkuFontSize(barcodeSettings.itemSkuFontSize);

      if (barcodeSettings.selectedViewType)
        setSelectedViewType(barcodeSettings.selectedViewType);
    }
  }, []);

  return (
    <Dialog
      title={"Печать штрих код товара"}
      onClose={onClose}
      height={"90vh"}
      width={"90vw"}
      isOpen={type === "print" && !!item?.id}
    >
      <div className="h-[64vh] overflow-y-auto mb-5">
        <div className="flex justify-between gap-x-12">
          <div className="w-3/5 flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4">
              <InputGroup>
                <Input
                  value={barcode}
                  disabled={true}
                  placeholder="Штрих код"
                  onChange={(e) => setBarcode(e.target.value)}
                />
                <SelectItemBarcodeType
                  defaultTypeValue={barcodeType ? barcodeType?.value : null}
                  onChange={setBarcodeType}
                  className="w-56"
                />
              </InputGroup>

              {/* <FormItem label={t("Формат")}> */}
              <Select
                options={viewTypes}
                hideSelectedOptions
                onChange={setSelectedViewType as any}
                value={selectedViewType}
              />
              {/* </FormItem> */}

              <InputGroup>
                <Input
                  autoComplete="off"
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                  ref={null}
                  placeholder={t("Цена продукта", {
                    name: t("Приходная цена").toLowerCase(),
                  })}
                  type="number"
                />
                <Addon>{itemCurrency?.name}</Addon>
              </InputGroup>
            </div>

            <div className="flex flex-col gap-y-6">
              {viewBarcode ? (
                <div className="flex items-center">
                  <div className="w-[220px] text-base">Ширина штрих-кода:</div>
                  <RangeSlider
                    style={{ width: "100%" }}
                    value={barcodeWidth}
                    size={"lg"}
                    min={1}
                    step={0.1}
                    max={10}
                    onChange={(changeEvent) =>
                      setBarcodeWidth(+changeEvent.target.value)
                    }
                  />
                </div>
              ) : null}

              {viewBarcode ? (
                <div className="flex items-center">
                  <div className="w-[220px] text-base">Высота штрих-кода:</div>
                  <RangeSlider
                    style={{ width: "100%" }}
                    value={barcodeHeight}
                    size={"lg"}
                    min={10}
                    step={0.1}
                    max={150}
                    onChange={(changeEvent) =>
                      setBarcodeHeight(+changeEvent.target.value)
                    }
                  />
                </div>
              ) : null}

              <div className="flex items-center">
                <div className="w-[220px] text-base">
                  Расстояние между штрих-кодом и текстом:
                </div>
                <RangeSlider
                  style={{ width: "100%" }}
                  value={barcodeMarginBottom}
                  size={"lg"}
                  step={0.1}
                  min={1}
                  max={150}
                  onChange={(changeEvent) =>
                    setBarcodeMarginBottom(+changeEvent.target.value)
                  }
                />
              </div>

              <div className="flex items-center">
                <div className="w-[220px] text-base">Размер штрих-кода:</div>
                <RangeSlider
                  style={{ width: "100%" }}
                  value={barcodeFontSize}
                  size={"lg"}
                  step={0.1}
                  min={2}
                  max={50}
                  onChange={(changeEvent) =>
                    setBarcodeFontSize(+changeEvent.target.value)
                  }
                />
              </div>

              {viewItemName ? (
                <div className="flex items-center">
                  <div className="w-[220px] text-base">
                    Размер названия продукта:
                  </div>
                  <RangeSlider
                    style={{ width: "100%" }}
                    value={itemNameFontSize}
                    size={"lg"}
                    step={0.1}
                    min={2}
                    max={50}
                    onChange={(changeEvent) =>
                      setItemNameFontSize(+changeEvent.target.value)
                    }
                  />
                </div>
              ) : null}

              {viewItemPrice ? (
                <div className="flex items-center">
                  <div className="w-[220px] text-base">
                    Размер названия продукта:
                  </div>
                  <RangeSlider
                    style={{ width: "100%" }}
                    value={itemPriceFontSize}
                    size={"lg"}
                    step={1}
                    min={5}
                    max={100}
                    onChange={(changeEvent) =>
                      setItemPriceFontSize(+changeEvent.target.value)
                    }
                  />
                </div>
              ) : null}

              {selectedViewType && selectedViewType?.value === 2 && (
                <div className="flex items-center">
                  <div className="w-[220px] text-base">Ширина текста:</div>
                  <RangeSlider
                    style={{ width: "100%" }}
                    value={itemSmallPriceFontSize}
                    size={"lg"}
                    step={1}
                    min={5}
                    max={100}
                    onChange={(changeEvent) =>
                      setItemSmallPriceFontSize(+changeEvent.target.value)
                    }
                  />
                </div>
              )}

              <div className="flex items-center">
                <div className="w-[220px] text-base">Размер цена продукта:</div>
                <RangeSlider
                  style={{ width: "100%" }}
                  value={itemNameAndPriceWidth}
                  size={"lg"}
                  step={0.1}
                  min={20}
                  max={500}
                  onChange={(changeEvent) =>
                    setItemNameAndPriceWidth(+changeEvent.target.value)
                  }
                />
              </div>

              {viewItemSku ? (
                <div className="flex items-center">
                  <div className="w-[220px] text-base">Размер артикул</div>
                  <RangeSlider
                    style={{ width: "100%" }}
                    value={itemSkuFontSize}
                    size={"lg"}
                    step={0.1}
                    min={2}
                    max={50}
                    onChange={(changeEvent) =>
                      setItemSkuFontSize(+changeEvent.target.value)
                    }
                  />
                </div>
              ) : null}

              <div className="flex items-center">
                <div className="w-[220px] text-base">
                  Показать название продукта:
                </div>
                <Switcher checked={viewItemName} onChange={setViewItemName} />
              </div>

              <div className="flex items-center">
                <div className="w-[220px] text-base">
                  Показать цена продукта:
                </div>
                <Switcher checked={viewItemPrice} onChange={setViewItemPrice} />
              </div>

              <div className="flex items-center">
                <div className="w-[220px] text-base">
                  Показать сегодняшнюю дату:
                </div>
                <Switcher
                  checked={viewNowDateTime}
                  onChange={setViewNowDateTime}
                />
              </div>

              <div className="flex items-center">
                <div className="w-[220px] text-base">Показать артикул:</div>
                <Switcher checked={viewItemSku} onChange={setViewItemSku} />
              </div>

              <div className="flex items-center">
                <div className="w-[220px] text-base">Показать штрих код:</div>
                <Switcher checked={viewBarcode} onChange={setViewBarcode} />
              </div>
            </div>
          </div>
          {/* 🔹 Добавлен стиль для печати без отступов */}
          <style>
            {`
  @media print {
    @page {
      margin: 0 !important;
    }
    body, html {
      margin: 0 !important;
      padding: 0 !important;
    }
    #printBarcode * {
      all: unset !important;
      display: revert !important;
    }
    #printBarcode {
      margin: 0 !important;
      padding: 0 !important;
    }
  }
`}
          </style>
          <div className="w-2/5 h-max p-2 bg-gray-100">
            <div id="printBarcode">
              {!isValid ? (
                <p className="text-red-500">{t("Неправильный формат!")}</p>
              ) : null}
              {selectedViewType && selectedViewType.value === 1 ? (
                <div>
                  {viewBarcode && (
                    <div>
                      <div className="bg-white p-2 mb-4">
                        <Barcode
                          value={barcode}
                          options={options}
                          className="w-full"
                        />
                      </div>
                      <div
                        className={"m-auto mb-5"}
                        style={{
                          width: itemNameAndPriceWidth + "px",
                        }}
                      >
                        {viewItemName && item?.name ? (
                          <div
                            className="font-bold mb-5"
                            style={{
                              lineHeight: 1,
                              fontSize: itemNameFontSize + "px",
                            }}
                          >
                            {item?.name}
                          </div>
                        ) : null}
                        {viewItemPrice && priceAmount ? (
                          <div
                            className="font-bold"
                            style={{
                              lineHeight: 1,
                              fontSize: itemPriceFontSize + "px",
                            }}
                          >
                            <FormattedNumber value={priceAmount} />
                            &nbsp;
                            <small>{itemCurrency?.name}</small>
                          </div>
                        ) : null}
                      </div>

                      {viewNowDateTime ? (
                        <div
                          className={"font-bold small"}
                          style={{
                            lineHeight: 1,
                            minWidth: 80,
                          }}
                        >
                          {dayjs(new Date()).format("YYYY-MM-DD")}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div
                    className={"m-auto text-center"}
                    style={{ width: itemNameAndPriceWidth + "px" }}
                  >
                    {viewItemPrice && priceAmount && (
                      <div
                        className="font-bold flex w-100 justify-center items-end"
                        style={{
                          lineHeight: 1,
                          fontSize: itemPriceFontSize + "px",
                        }}
                      >
                        <FormattedNumber value={priceAmount} />
                        &nbsp;
                        <small>{itemCurrency?.name}</small>
                      </div>
                    )}
                    {viewItemName && item?.name ? (
                      <div
                        className="font-bold text-center mt-2"
                        style={{
                          lineHeight: 1,
                          fontSize: itemNameFontSize + "px",
                        }}
                      >
                        {item?.name}
                      </div>
                    ) : null}
                  </div>

                  <div className={"flex items-end justify-center"}>
                    {viewBarcode ? (
                      <div className={"text-start"}>
                        <Barcode
                          value={barcode}
                          options={options}
                          className="w-full"
                        />
                      </div>
                    ) : null}
                    {viewNowDateTime ? (
                      <div
                        className={"font-bold small mb-2 w-100"}
                        style={{
                          lineHeight: 1,
                          minWidth: 80,
                        }}
                      >
                        {dayjs(new Date()).format("YYYY-MM-DD")}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {viewItemSku ? (
                <div
                  className={"font-bold"}
                  style={{
                    lineHeight: 1,
                    fontSize: itemSkuFontSize + "px",
                  }}
                >
                  {item?.catalog_code}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={onPrint} icon={<FaPrint />} variant="solid">
          {t("Распечатать")}
        </Button>
      </div>
    </Dialog>
  );
};

export default PrintCheckProduct;

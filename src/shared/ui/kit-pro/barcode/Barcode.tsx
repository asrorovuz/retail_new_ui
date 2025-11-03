import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
  options?: JsBarcode.Options;
  className?: string;
}

const Barcode: React.FC<BarcodeProps> = ({ value, options = {}, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, value, options);
      } catch (err) {
        console.error("Barcode error:", err);
      }
    }
  }, [value, JSON.stringify(options)]); // 🔥 options o‘zgarsa ham qayta render qiladi

  return <svg ref={svgRef} className={className}></svg>;
};

export default Barcode;

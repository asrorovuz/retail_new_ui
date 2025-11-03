import React from "react";

interface RangeSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  showValue?: boolean;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  size = "md",
  onChange,
  style,
  showValue = false,
}) => {
  return (
    <div className={`range-slider range-slider--${size}`} style={style}>
      <input
        type="range"
        className="range-slider__input"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        style={{
          background: `linear-gradient(to right, #007aff ${
            ((value - min) / (max - min)) * 100
          }%, #ddd ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      {showValue && <div className="range-slider__value">{value}</div>}
    </div>
  );
};

export default RangeSlider;

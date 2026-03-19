type EmptyProps = {
  size?: number;
  textSize?: string;
  text?: string;
};

const Empty = ({
  size = 200,
  textSize = "text-2xl",
  text = "Нет данных",
}: EmptyProps) => {
  return (
    <div className="flex flex-col justify-center items-center text-slate-400">
      <svg
        width={size}
        height={size}
        viewBox="0 0 215 212"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-slate-300"
      >
        <path
          d="M53.9547 35.2088C53.9547 35.2088 86.1138 59.6124 135.004 13.9815C178.423 -26.543 213.875 37.3956 214.123 68.0144C214.445 107.679 170.704 139.414 191.931 165.466C213.159 191.518 149.835 234.538 115.706 197.307C73.2521 150.993 61.7504 188.623 37.5518 188.623C20.1841 188.623 -15.4736 145.469 8.60573 113.363C28.8681 86.347 17.8177 77.3807 12.4651 68.0144C4.74621 54.5062 23.0788 17.8411 53.9547 35.2088Z"
          fill="currentColor"
          className="opacity-30"
        />
        <path
          d="M105.987 90.6969V181.257L35.6743 150.887L36.0098 60.6543L105.987 90.6969Z"
          fill="currentColor"
        />
        <path
          d="M105.988 90.7509V181.311L175.958 151.99V60.9434L105.988 90.7509Z"
          fill="currentColor"
          className="opacity-70"
        />
        <path
          d="M105.987 90.6973L176.299 61.247L106.539 30.3242L35.6743 60.5108L105.987 90.6973Z"
          fill="currentColor"
          className="opacity-50"
        />
      </svg>

      <p className={`${textSize} font-normal text-slate-400`}>{text}</p>
    </div>
  );
};

export default Empty;
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";

export type PriceType = {
  id: number;
  product_price_type: {
    id: number;
    name: string;
    is_primary: boolean;
    is_bulk: boolean;
  };
  currency: {
    code: number;
    created_at: string;
    updated_at: string;
    name: string;
    rate: number;
    is_national: boolean;
    is_active: boolean;
    is_default: boolean;
  };
  amount: number;
};

type Propstype = {
  name: string;
  prices?: PriceType[];
  img: any | { id: number; name: string; fs_url: string }[] | [];
  onItemChange: () => void;
};

const FavouriteCard = ({ name, prices, img, onItemChange }: Propstype) => {
  
  const price = prices?.find(
    (el) => el?.product_price_type?.name === "Розничный"
  );

  return (
    <article
      onClick={onItemChange}
      className="flex justify-between bg-white rounded-lg max-h-[72px] overflow-hidden active:bg-gray-100 active:scale-105 transition-all duration-300"
    >
      <div className="w-full p-4">
        <h4 className="text-base font-semibold line-clamp-1">{name}</h4>
        <p className="text-sm font-normal">
          <FormattedNumber value={Number(price?.amount ?? 0)} /> Сум
        </p>
      </div>
      {img?.length > 0 && (
        <div className="w-[150px] h-[72px]">
          <img
            className="w-full h-full object-contain"
            src={img?.[0]?.fs_url}
            alt={img?.[0]?.name}
          />
        </div>
      )}
    </article>
  );
};

export default FavouriteCard;

import type { DraftSaleSchema } from "@/@types/sale";
import { PaymentTypes } from "@/app/constants/payment.types";

type Props = {
  addDrafts: (payload: DraftSaleSchema) => void;
};

export function addNewSaleAndActivate({ addDrafts }: Props) {
  const newDraftSale: DraftSaleSchema = {
    items: [],
    isActive: true,
    discountAmount: 0,
    payment: {
      amounts: PaymentTypes.map((paymentType) => {
        return { amount: 0, paymentType: paymentType.type };
      }),
    },
  };
  addDrafts(newDraftSale);
}

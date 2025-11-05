import type { DraftRefundSchema } from "@/@types/refund";
import type { DraftSaleSchema } from "@/@types/sale";

export type CashboxPropsType = {
  type: "sale" | "refund";
  drafts: DraftSaleSchema[] | DraftRefundSchema[];
  addNewDraft: (payload: DraftSaleSchema | DraftRefundSchema) => void;
  activateDraft: (index: number) => void;
};

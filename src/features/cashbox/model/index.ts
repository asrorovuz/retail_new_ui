import type { DraftSaleSchema } from "@/@types/sale";

export type CashboxPropsType = {
  drafts: DraftSaleSchema[];
  addNewDraft: (payload: DraftSaleSchema) => void;
  activateDraft: (index: number) => void;
};

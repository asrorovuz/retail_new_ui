import type React from "react";
import type { DraftPurchaseSchema } from "@/@types/purchase";
import type { DraftRefundSchema } from "@/@types/refund";
import type { DraftSaleSchema } from "@/@types/sale";
import type { RevisionDraft } from "@/app/store/useRevision";

type BaseProps = {
    activateDraft: (index: number) => void;
    setLocalContractorId?: (val: number | null) => void;
    localContractorId?: number | null;
    setExpandedId?: React.Dispatch<React.SetStateAction<number | null>>;
};

export type CashboxPropsType =
    | ({
          type: "sale";
          drafts: DraftSaleSchema[];
          addNewDraft: (payload: DraftSaleSchema) => void;
      } & BaseProps)
    | ({
          type: "refund";
          drafts: DraftRefundSchema[];
          addNewDraft: (payload: DraftRefundSchema) => void;
      } & BaseProps)
    | ({
          type: "purchase";
          drafts: DraftPurchaseSchema[];
          payModal?: boolean;
          addNewDraft: (payload: DraftPurchaseSchema) => void;
      } & BaseProps);

export type CashboxRevisionPropsType = {
    type: "revision";
    drafts: RevisionDraft[];

    addNewDraft: (payload: RevisionDraft) => void;
} & BaseProps;

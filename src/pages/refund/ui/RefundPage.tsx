import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import Cashbox from "@/features/cashbox"

const RefundPage = () => {
  const { draftRefunds, addDraftRefund, activateDraftRefund } = useDraftRefundStore((store) => store);

  return (
    <div className="flex justify-between gap-x-2">
      <div className="bg-white p-4 rounded-3xl w-full max-w-[662px]">
        <Cashbox drafts={draftRefunds} addNewDraft={addDraftRefund} activateDraft={activateDraftRefund}/>
      </div>
    </div>
  )
}

export default RefundPage
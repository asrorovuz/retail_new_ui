export type CashboxType = {
    id: number
    created_at: Date
    updated_at: Date
    deleted_at?: Date | null
    is_deleted: boolean
    name: string
}
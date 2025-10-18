import { Skeleton, Table } from '@/shared/ui/kit'
import type { SkeletonProps } from '@/shared/ui/kit'

type TableRowSkeletonProps = {
    columns?: number
    rows?: number
    avatarInColumns?: number[]
    avatarProps?: SkeletonProps
}

const { Tr, Td, TBody } = Table

const TableRowSkeleton = (props: TableRowSkeletonProps) => {
    const { columns = 1, rows = 10, avatarInColumns = [], avatarProps } = props

    return (
        <TBody>
            {Array.from(new Array(rows), (_, i) => i + 1).map((row) => (
                <Tr key={`row-${row}`}>
                    {Array.from(new Array(columns), (_, i) => i + 1).map(
                        (col) => (
                            <Td key={`col-${col}`}>
                                <div className="flex flex-auto items-center gap-2">
                                    {avatarInColumns.includes(col) && (
                                        <div>
                                            <Skeleton
                                                variant="circle"
                                                {...avatarProps}
                                            />
                                        </div>
                                    )}
                                    <Skeleton />
                                </div>
                            </Td>
                        ),
                    )}
                </Tr>
            ))}
        </TBody>
    )
}

export default TableRowSkeleton

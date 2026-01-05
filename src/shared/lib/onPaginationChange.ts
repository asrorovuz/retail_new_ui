import pagination from '@/shared/ui/kit/Pagination'

export const onChangePagination = (updater: any, params: any, setParams: any) => {
    const nextState = updater(pagination)
    setParams({
        ...params,
        ...(nextState.pageIndex || nextState.pageIndex === 0
            ? { skip: nextState.pageIndex * (params.limit || 1) }
            : {}),
        ...(nextState.pageSize
            ? {
                limit: nextState.pageSize,
                skip:
                    nextState.pageSize *
                    (params.skip / (params.limit || 1)),
            }
            : {}),
    })
}
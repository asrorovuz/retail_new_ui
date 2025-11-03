const Total = (props: { total: number }) => {
    const { total } = props
    return (
        <div className="pagination-total text-[14px]">
            Всего <span>{total}</span> элементов
        </div>
    )
}

export default Total

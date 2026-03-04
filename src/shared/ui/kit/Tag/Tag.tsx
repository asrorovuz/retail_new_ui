import classNames from '../utils/classNames'
import type { CommonProps } from '../@types/common'
import type { ReactNode, Ref } from 'react'

export interface TagProps extends CommonProps {
    children: ReactNode
    prefix?: boolean | ReactNode
    prefixClass?: string
    ref?: Ref<HTMLDivElement>
    suffix?: boolean | ReactNode
    suffixClass?: string
}

const Tag = (props: TagProps) => {
    const {
        className,
        children,
        prefix,
        ref,
        suffix,
        prefixClass,
        suffixClass,
        ...rest
    } = props

    const tagDefaultColor =
        'bg-slate-100 dark:bg-slate-700 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-slate-50'

    return (
        <div
            ref={ref}
            className={classNames('tag', tagDefaultColor, className)}
            {...rest}
        >
            {prefix && typeof prefix === 'boolean' && (
                <span
                    className={classNames('tag-affix tag-prefix', prefixClass)}
                />
            )}
            {typeof prefix === 'object' && prefix}
            {children}
            {suffix && typeof suffix === 'boolean' && (
                <span
                    className={classNames('tag-affix tag-suffix', suffixClass)}
                />
            )}
            {typeof suffix === 'object' && suffix}
        </div>
    )
}

export default Tag

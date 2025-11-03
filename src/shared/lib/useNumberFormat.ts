import { useMemo } from 'react'

interface NumberFormatConfig {
    decimalSeparator: string
    thousandSeparator: string
    allowedDecimalSeparators: string[]
    decimalScale?: number
}

export function useNumberFormat(
    numberFormat: 'comma' | 'dot' | 'decimal' | 'money',
    scale: number | null
): NumberFormatConfig {
    return useMemo(() => {
        const decimalSeparator =
            numberFormat === 'dot' || numberFormat === 'money' ? ',' : '.'

        const thousandSeparator =
            numberFormat === 'comma' ? ',' :
                numberFormat === 'dot' ? '.' :
                    ' '

        return {
            decimalSeparator,
            thousandSeparator,
            allowedDecimalSeparators: [decimalSeparator, decimalSeparator === '.' ? ',' : '.'],
            ...(scale !== null ? { decimalScale: scale } : {})
        }
    }, [numberFormat, scale])
}

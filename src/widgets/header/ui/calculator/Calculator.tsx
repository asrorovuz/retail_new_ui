import { Button } from '@/shared/ui/kit'
// import { useRef } from 'react'
// import { IoMagnet } from 'react-icons/io5'
// import { MdBackspace } from 'react-icons/md'

type CalculatorpropsType = {
    value: string
    setValue: (value: string) => void
    loading: boolean
    onClick: () => void
    activeSelectPaymetype: number
    onPaymentChanged: (type: number, value: number) => void
    magnetValue: string
}

const Calculator = ({
    setValue,
    value,
    // loading,
    // onClick,
    onPaymentChanged,
    activeSelectPaymetype,
    // magnetValue = '0',
}: CalculatorpropsType) => {
    // const holdTimer = useRef<any | null>(null)
    const onClickNumber = (newValue: string) => {
        const updatedValue = value + newValue
        setValue(updatedValue)
        onPaymentChanged(activeSelectPaymetype, +updatedValue)
    }

    // const onBackSpaceDown = () => {
    //     // 1s bosib turilsa tozalash
    //     holdTimer.current = setTimeout(() => {
    //         setValue('')
    //         onPaymentChanged(activeSelectPaymetype, 0)
    //     }, 1000)
    // }

    const onDotBtnFired = () => {
        if (!value.includes('.')) {
            const newStr = value + '.'
            setValue(newStr)
            onPaymentChanged(activeSelectPaymetype, +newStr)
        }
    }

    // const onBackSpaceUp = () => {
    //     if (holdTimer.current) {
    //         clearTimeout(holdTimer.current)
    //         holdTimer.current = null

    //         // Agar vaqt tugamagan bo‘lsa → oxirgi belgi o‘chirilsin
    //         if (value.length > 0) {
    //             const newStr = value.slice(0, -1)
    //             setValue(newStr)
    //             onPaymentChanged(activeSelectPaymetype, +newStr)
    //         }
    //     }
    // }

    // const onSubmit = () => {
    //     onClick()
    // }

    return (
        <div className="w-full">
            {/* Grid */}
            <div className="grid grid-cols-3 gap-1.5">
                {/* Row 1 */}
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('7')}
                >
                    7
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('8')}
                >
                    8
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('9')}
                >
                    9
                </Button>
                {/* <Button
                    size={'lg'}
                    variant={'plain'}
                    className={
                        'bg-gray-400 text-white! active:text-white! rounded text-2xl h-20 flex justify-center items-center'
                    }
                    onClick={() => {
                        if (magnetValue === '0') {
                            onPaymentChanged(activeSelectPaymetype, +value)
                        } else {
                            const newStr = +value + +magnetValue
                            setValue(String(newStr))
                            onPaymentChanged(activeSelectPaymetype, newStr)
                        }
                    }}
                >
                    <IoMagnet style={{ rotate: '90deg' }} />
                </Button> */}

                {/* Row 2 */}
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('4')}
                >
                    4
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('5')}
                >
                    5
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('6')}
                >
                    6
                </Button>
                {/* <Button
                    variant="plain"
                    className="bg-red-500 text-white !active:text-white rounded text-2xl h-20 flex items-center justify-center"
                    onPointerDown={onBackSpaceDown}
                    onPointerUp={onBackSpaceUp}
                    onPointerCancel={onBackSpaceUp}
                    onPointerLeave={onBackSpaceUp}
                >
                    <MdBackspace />
                </Button> */}

                {/* Row 3 */}
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('1')}
                >
                    1
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('2')}
                >
                    2
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('3')}
                >
                    3
                </Button>
                {/* <Button
                    loading={loading}
                    variant="plain"
                    className="bg-green-500 text-white !active:text-white rounded px-5 text-wrap text-[16px] h-full col-span-1 row-span-2 flex items-center justify-center"
                    onClick={onSubmit}
                >
                    Завершение <br /> оплата
                </Button> */}

                {/* Row 4 */}
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('0')}
                >
                    0
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={() => onClickNumber('.')}
                >
                    .
                </Button>
                <Button
                    variant="solid"
                    className="bg-white p-4 font-medium! text-xl text-gray-800 h-full"
                    onClick={onDotBtnFired}
                >
                    .s
                </Button>
            </div>
        </div>
    )
}

export default Calculator

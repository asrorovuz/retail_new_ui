import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { Card } from '@/shared/ui/kit'

export type AccordionProps = PropsWithChildren<{
    title: string;
}>

export function Accordion({title = 'Test', children}: AccordionProps) {
    const [ isOpen, setIsOpen ] = useState(false)

    return (
        <Card bodyClass={"p-0"}>
            <button
                className="flex items-center justify-between w-full text-left font-medium text-gray-100 p-3 hover:bg-gray-600 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="flex items-center">
                    {isOpen ? (
                        <FiChevronDown size={20} className="text-gray-100" />
                    ) : (
                        <FiChevronRight size={20} className="text-gray-100" />
                    )}

                    <h6 className="ml-2 font-bold">
                        {title}
                    </h6>
                </span>
            </button>
            {isOpen && (
                <div className="p-3 mt-2 text-gray-600">
                    {children}
                </div>
            )}
        </Card>
    )
}

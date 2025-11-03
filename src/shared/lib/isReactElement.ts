import { isValidElement, type ReactElement, type ReactNode } from 'react'

export default function isReactElement(child: ReactNode): child is ReactElement {
    return isValidElement(child)
}

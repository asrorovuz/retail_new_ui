import React from 'react';
import { Button } from '@/shared/ui/kit'
import type { ButtonProps } from '@/shared/ui/kit'

export interface SignButtonProps extends ButtonProps {
    onSign?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SignButton: React.FC<SignButtonProps> = ({ 
    children, 
    onSign, 
    ...rest 
}) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onSign) {
            onSign(e);
        }
    };

    return (
        <Button {...rest} onClick={handleClick}>
            {children}
        </Button>
    );
};

export default SignButton;

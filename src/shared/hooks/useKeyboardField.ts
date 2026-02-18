// useKeyboardInput.tsx - Hook to connect any input to the keyboard
import { useKeyboard } from '@/app/providers/KeyboardProvider';
import { useRef, useEffect } from 'react';

export const useKeyboardInput = (
  type: 'numeric' | 'qwerty' | 'alphanumeric',
  value: string,
  onChange: (val: string) => void,
) => {
  const { registerField, unregisterField } = useKeyboard();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const field = {
      type,
      ref: ref as React.RefObject<HTMLInputElement>,
      onChange,
    };

    const handleFocus = () => {
      registerField(field);
    };

    const handleBlur = () => {
      unregisterField();
    };

    const input = ref.current;
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      unregisterField();
    };
  }, [type, onChange, registerField, unregisterField]);

  // Prevent native keyboard from opening (for virtual keyboard only)
  const preventNativeKeyboard = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return {
    ref,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value), // For manual edits if needed
    onKeyDown: preventNativeKeyboard, // Block native keyboard
    onKeyPress: preventNativeKeyboard,
    onKeyUp: preventNativeKeyboard,
  };
};
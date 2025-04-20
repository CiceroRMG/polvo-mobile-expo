import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';

interface AppInputProps extends TextInputProps {
  disableFocusStyles?: boolean;
}

export function AppInput({
  className = '',
  placeholderClassName,
  onFocus,
  onBlur,
  disableFocusStyles = false,
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <TextInput
      className={cn(
        'w-full px-6 rounded-2xl text-primary bg-input native:text-base',
        'placeholder:text-main-inputText native:h-[60px] border border-input',
        isFocused && !disableFocusStyles && 'border-2 border-main-purple',
        props.editable === false && 'opacity-50',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}
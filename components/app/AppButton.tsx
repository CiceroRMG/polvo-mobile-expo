import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

import { cn } from '~/lib/utils';

interface AppButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AppButton({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  ...props
}: AppButtonProps) {
  const variantClasses = {
    primary: 'bg-main-purple',
    secondary: 'bg-main-borderColor',
    outline: 'bg-transparent border-2 border-main-purple',
  };

  const textClasses = {
    primary: 'text-primary',
    secondary: 'text-gray-800',
    outline: 'text-main-purple',
  };

  return (
    <Pressable
      disabled={disabled}
      className={cn(
        'px-6 py-5 rounded-2xl justify-center items-center native:h-[60px]',
        'active:opacity-80',
        variantClasses[variant],
        className,
        disabled && 'opacity-70',
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={cn('font-bold text-base', textClasses[variant])}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

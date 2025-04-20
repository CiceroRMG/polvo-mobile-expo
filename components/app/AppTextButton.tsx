import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
import { cn } from '~/lib/utils';

interface AppTextButtonProps extends PressableProps {
  children: React.ReactNode;
  textClassName?: string;
  rippleColor?: string;
}

export function AppTextButton({ 
  children, 
  className = '', 
  textClassName = '',
  rippleColor = 'rgba(0, 0, 0, 0.014)',
  ...props 
}: AppTextButtonProps) {
  return (
    <Pressable
      className={cn('px-4 py-3', className)}
      android_ripple={{ color: rippleColor, radius: 10 }}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={cn('text-main-purple font-semibold text-sm', textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
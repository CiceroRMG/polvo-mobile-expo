import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import { cn } from '~/lib/utils';
import { useColorScheme } from '~/lib/useColorScheme';

interface AppBackButtonProps extends PressableProps {
  iconSize?: number;
  label?: string;
  labelClassName?: string;
  className?: string;
}

export const AppBackButton = React.forwardRef<React.ElementRef<typeof Pressable>, AppBackButtonProps>(
  (
    {
      iconSize = 28,
      label,
      labelClassName = '',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === 'dark' ? '#fff' : undefined;
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex-row items-center gap-2 mb-8 w-full',
          className,
          disabled && 'opacity-60'
        )}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={label || 'Voltar'}
        {...props}
      >
        <ArrowLeft size={iconSize} color={iconColor} />
        {label ? (
          <Text className={cn('text-base text-foreground', labelClassName)}>{label}</Text>
        ) : null}
      </Pressable>
    );
  }
);

AppBackButton.displayName = 'AppBackButton';

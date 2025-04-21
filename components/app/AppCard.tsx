import { CaretRight } from 'phosphor-react-native';
import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';

import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

interface AppCardProps extends PressableProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  className?: string;
}

export function AppCard({
  title,
  subtitle,
  onPress,
  className = '',
  ...props
}: AppCardProps) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#fff' : '#797979';
  return (
    <View className="overflow-hidden rounded-2xl">
      <Pressable
        {...props}
        onPress={onPress}
        className={cn(
          'flex-row items-center justify-between rounded-2xl border-2 border-main-card bg-main-card px-6 py-5',
          className,
        )}
        android_ripple={{
          color: 'rgba(99, 101, 242, 0.027)',
          borderless: false,
        }}
      >
        <View className="gap-1">
          <Text className="text-lg font-semibold text-primary">{title}</Text>
          {subtitle ? (
            <Text className="text-sm text-main-inputText">{subtitle}</Text>
          ) : null}
        </View>
        <CaretRight size={20} color={iconColor} />
      </Pressable>
    </View>
  );
}

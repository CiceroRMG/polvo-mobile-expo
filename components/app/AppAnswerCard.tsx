import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

interface AppAnswerCardProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function AppAnswerCard({
  children,
  selected = false,
  onPress,
  className = '',
}: AppAnswerCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center rounded-2xl border border-main-borderColor bg-main-card px-4 py-5',
        selected ? 'border-main-textPurple' : 'border-main-borderColor',
        className,
      )}
      android_ripple={{ color: 'rgba(99, 101, 242, 0.07)', borderless: false }}
    >
      <Text className="text-main-primary mr-2 flex-1 text-base">
        {children}
      </Text>

      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-full border-2',
          selected ? 'border-main-purple' : 'border-main-borderColor',
        )}
      >
        {selected && (
          <View className="h-3.5 w-3.5 rounded-full bg-main-purple" />
        )}
      </View>
    </Pressable>
  );
}

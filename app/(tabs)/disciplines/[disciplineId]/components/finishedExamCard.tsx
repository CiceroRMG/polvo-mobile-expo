import { View, Text, Pressable } from 'react-native';

import { cn } from '~/lib/utils';

interface Props {
  title: string;
  score: string;
  startedAt: string;
  endedAt: string;
  onPress?: () => void;
  className?: string;
}

export function FinishedExamCard({
  title,
  score,
  startedAt,
  endedAt,
  onPress,
  className = '',
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl">
      <Pressable
        onPress={onPress}
        className={cn(
          'rounded-2xl border-2 border-main-card bg-main-card px-6 py-5',
          className,
        )}
        android_ripple={{
          color: 'rgba(99, 101, 242, 0.027)',
          borderless: false,
        }}
      >
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="max-w-[70%] text-lg font-semibold text-primary">
            {title}
          </Text>
          <Text className="font-bold text-main-purple">Nota: {score}</Text>
        </View>

        <View className="gap-1">
          <Text className="text-xs text-main-inputText">
            Início: {startedAt}
          </Text>
          <Text className="text-xs  text-main-inputText">Fim: {endedAt}</Text>
        </View>
      </Pressable>
    </View>
  );
}

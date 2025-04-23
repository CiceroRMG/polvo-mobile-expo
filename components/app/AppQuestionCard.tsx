import React from 'react';
import { View, ViewProps } from 'react-native';

import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

interface AppQuestionCardProps extends ViewProps {
  title: string;
  questionText?: string;
  className?: string;
}

export function AppQuestionCard({
  title,
  questionText,
  className = '',
  ...props
}: AppQuestionCardProps) {
  return (
    <View
      {...props}
      className={cn(
        'rounded-2xl border border-main-borderColor bg-main-card px-6 py-8',
        className,
      )}
    >
      <View className="w-full gap-4">
        <Text className="w-full text-center text-2xl font-semibold text-primary">
          {title}
        </Text>

        <View className="my-2 h-2 w-full border-t border-main-borderColor" />

        {questionText ? (
          <Text className="text-main-primary text-center text-base">
            {questionText}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

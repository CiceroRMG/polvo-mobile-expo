import { View, Pressable, Text } from 'react-native';

import { cn } from '~/lib/utils';

type Tab = 'available' | 'done';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

export function TabHeader({ active, onChange }: Props) {
  return (
    <View className="mb-4 flex-row  self-center rounded-xl bg-main-cardDark p-1">
      {(['available', 'done'] as Tab[]).map(tab => (
        <Pressable
          key={tab}
          onPress={() => onChange(tab)}
          className={cn(
            'rounded-lg px-4 py-2 ',
            active === tab && 'bg-main-purple',
          )}
        >
          <Text
            className={cn(
              'font-semibold',
              active === tab ? 'text-white' : 'text-primary',
            )}
          >
            {tab === 'available' ? 'Disponíveis' : 'Concluídas'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

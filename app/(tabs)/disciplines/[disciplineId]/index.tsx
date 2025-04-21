import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View, FlatList } from 'react-native';

import { AppBackButton } from '~/components/app/AppBackButton';
import { AppCard } from '~/components/app/AppCard';

const mockDisciplines = [
  { id: '1', title: 'Quiz 1' },
  { id: '2', title: 'Quiz 2' },
  { id: '3', title: 'Quiz 3' },
  { id: '4', title: 'Quiz 4' },
];

export default function DisciplineDetail() {
  const { disciplineId } = useLocalSearchParams();

  const handleQuizzPress = (quizzId: string) => {
    router.push(`/disciplines/${disciplineId}/${quizzId}`);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="w-full flex-1 px-6">
        <View className="flex-row items-center gap-3">
          <AppBackButton
            label={`Id da disciplina: ${disciplineId}`}
            labelClassName="text-3xl font-bold text-primary ml-2"
          />
        </View>

        <Text className="mb-2 ml-2 text-xl font-semibold text-main-purple">
          Atividades Disponíveis
        </Text>

        <FlatList
          data={mockDisciplines}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AppCard
              onPress={() => handleQuizzPress(item.id)}
              title={item.title}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 24,
            gap: 14,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

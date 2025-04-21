import { router } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import * as React from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';

import { AppCard } from '~/components/app/AppCard';

const mockDisciplines = [
  { id: '1', title: 'Disciplina 1', subtitle: '#AWD32' },
  { id: '2', title: 'Disciplina 2', subtitle: '#BGT54' },
  { id: '3', title: 'Disciplina 3', subtitle: '#QWE12' },
  { id: '4', title: 'Disciplina 4', subtitle: '#ZXCV9' },
];

const handleDisciplinePress = (disciplineId: string) => {
  router.push(`/disciplines/${disciplineId}`);
};

export default function Disciplines() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-6">
        <Text className="mb-6 text-3xl font-bold text-primary">
          Suas Disciplinas
        </Text>
        <Text className="mb-2 ml-2 text-xl font-semibold text-main-purple">
          Ativas
        </Text>

        <FlatList
          data={mockDisciplines}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AppCard
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => handleDisciplinePress(item.id)}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 24,
            gap: 14,
          }}
          showsVerticalScrollIndicator={false}
        />

        <View className="mb-8 mt-8 items-end justify-end px-2">
          <Pressable
            onPress={() => router.push('/drive')}
            className="w-full flex-row items-center justify-between"
          >
            <Text className="text-base font-normal text-main-inputText">
              Inativas
            </Text>
            <CaretRight size={20} color="#797979" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

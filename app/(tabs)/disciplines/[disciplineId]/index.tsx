import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';

import { AppBackButton } from '~/components/app/AppBackButton';
import { AppCard } from '~/components/app/AppCard';
import { userService } from '~/lib/services/user';

const mockDisciplines = [
  { id: '1', title: 'Quiz 1' },
  { id: '2', title: 'Quiz 2' },
  { id: '3', title: 'Quiz 3' },
  { id: '4', title: 'Quiz 4' },
];

export default function DisciplineDetail() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectTests, setSubjectTests] = useState([]);

  const { disciplineId } = useLocalSearchParams();

  const handleQuizzPress = (quizzId: string) => {
    router.push(`/disciplines/${disciplineId}/${quizzId}`);
  };

  useEffect(() => {
    const fetchSubjectTests = async () => {
      try {
        setIsLoading(true);
        userService.getSubjectDataById(disciplineId as string);
      } catch (error) {
        console.error('Failed to fetch subject tests:', error);
        setError('Falha ao carregar suas provas tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectTests();
  }, [disciplineId]);

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

        {isLoading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : error ? (
          <Text className="text-red-500 text-center my-4">{error}</Text>
        ) : (
          <FlatList
            data={mockDisciplines}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <AppCard
                onPress={() => handleQuizzPress(item.id)}
                title={item.title}
                subtitle={item.title}
              />
            )}
            contentContainerStyle={{
              paddingBottom: 24,
              gap: 14,
            }}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 my-4">
                Não há atividades disponíveis para esta disciplina.
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

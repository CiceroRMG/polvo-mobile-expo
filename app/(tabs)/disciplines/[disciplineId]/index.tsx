import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';

import { AppBackButton } from '~/components/app/AppBackButton';
import { AppCard } from '~/components/app/AppCard';
import { storageService } from '~/lib/services/storage';
import { userService } from '~/lib/services/user';

interface DisciplineProps {
  id: string;
  title: string;
  subtitle?: string;
}

export default function DisciplineDetail() {
  // WE SHOULD GOT THIS FROM SOMEWHERE IN THE BACK-END THAT I DON'T KNOW YET -> ActionId
  const idOfThePermissionToSeeTests =
    process.env.EXPO_PUBLIC_API_SEE_TESTS_PERMISSION ?? '';

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectTests, setSubjectTests] = useState<DisciplineProps[]>([]);

  const { disciplineId, disciplineTitle } = useLocalSearchParams();

  const handleQuizzPress = (quizzId: string, quizzTitle: string) => {
    router.push({
      pathname: '/disciplines/[disciplineId]/[quizId]',
      params: {
        disciplineId: disciplineId as string,
        quizId: quizzId,
        quizzTitle,
      },
    });
  };

  useEffect(() => {
    const fetchSubjectTests = async () => {
      try {
        setIsLoading(true);
        const userId = (await storageService.getUser())?._id;

        if (!userId) {
          throw new Error('User ID not found');
        }

        const tests = await userService.getSubjectTests(
          disciplineId as string,
          idOfThePermissionToSeeTests,
          userId,
        );

        const formattedTests: DisciplineProps[] = tests.map(test => ({
          id: test.id,
          title: test.title,
          subtitle: test.instructions ?? '{{ Sem instruções disponíveis }}',
        }));
        setSubjectTests(formattedTests);
        setError(null);
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
            label={`${disciplineTitle}`}
            labelClassName="text-3xl font-bold text-primary ml-2"
          />
        </View>

        <Text className="mb-2 ml-2 text-xl font-semibold text-main-purple">
          Atividades Disponíveis
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : error ? (
          <Text className="my-4 text-center text-red-500">{error}</Text>
        ) : (
          <FlatList
            data={subjectTests}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <AppCard
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => handleQuizzPress(item.id, item.title)}
              />
            )}
            contentContainerStyle={{
              paddingBottom: 24,
              gap: 14,
            }}
            ListEmptyComponent={
              <Text className="my-4 text-center text-gray-500">
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

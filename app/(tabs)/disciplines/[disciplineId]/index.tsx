import { router, useLocalSearchParams } from 'expo-router';
import { Warning } from 'phosphor-react-native';
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
  startDate: string;
  endDate: string;
  subtitle?: string;
  endingSoon?: boolean;
}

export default function DisciplineDetail() {
  // WE SHOULD GOT THIS FROM SOMEWHERE IN THE BACK-END THAT I DON'T KNOW YET -> ActionId
  const idOfThePermissionToSeeTests =
    process.env.EXPO_PUBLIC_API_SEE_TESTS_PERMISSION ?? '';

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectTests, setSubjectTests] = useState<DisciplineProps[]>([]);

  const { disciplineId, disciplineTitle } = useLocalSearchParams();

  const isEndingSoon = (endDate: string): boolean => {
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 0 && diffHours < 1;
  };

  const handleQuizzPress = (
    quizzId: string,
    quizzTitle: string,
    quizzSubtitle: string,
    quizzStartDate: string,
    quizzEndDate: string,
  ) => {
    router.push({
      pathname: '/disciplines/[disciplineId]/[quizId]',
      params: {
        disciplineId: disciplineId as string,
        quizId: quizzId,
        quizzTitle,
        quizzSubtitle,
        quizzStartDate: quizzStartDate,
        quizzEndDate: quizzEndDate,
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
          startDate: test.initialDate,
          endDate: test.endDate,
          endingSoon: isEndingSoon(test.endDate),
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

  const renderTestItem = ({ item }: { item: DisciplineProps }) => (
    <AppCard
      title={item.title}
      subtitle={
        item.subtitle + (item.endingSoon ? ' - ' + 'Finaliza em 1 hora' : '')
      }
      onPress={() =>
        handleQuizzPress(
          item.id,
          item.title,
          item.subtitle ?? '',
          item.startDate,
          item.endDate,
        )
      }
      className={item.endingSoon ? 'border-2 border-red-500' : ''}
    >
      <View className="mt-2 flex-row items-center rounded-md bg-red-100 p-2">
        <Warning size={18} color="#FF3B30" weight="fill" />
        <Text className="ml-2 text-sm font-medium text-red-600">
          Atenção: Esta prova termina em menos de 1 hora!
        </Text>
      </View>
    </AppCard>
  );

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
            renderItem={renderTestItem}
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

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

import { AppBackButton } from '~/components/app/AppBackButton';
import { AppCard } from '~/components/app/AppCard';
import { storageService } from '~/lib/services/storage';
import { userService } from '~/lib/services/user';

import { FinishedExamCard } from './components/finishedExamCard';
import TabHeader from './components/tabHeader';
import { FinishedTest } from './mocks/finishedTests';

type Test = {
  id: string;
  title: string;
  subtitle?: string;
  fullSubtitle?: string;
  startDate: string;
  endDate: string;
  endingSoon?: boolean;
};

export default function DisciplineDetail() {
  const idOfThePermissionToSeeTests =
    process.env.EXPO_PUBLIC_API_SEE_TESTS_PERMISSION ?? '';

  const [activeTab, setActiveTab] = useState<'available' | 'done'>('available');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [finishedTests, setFinishedTests] = useState<FinishedTest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { disciplineId, disciplineTitle } = useLocalSearchParams();

  const isEndingSoon = (endDate: string): boolean => {
    const diffHours =
      (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 1;
  };

  const handleQuizzPress = (
    test: Pick<Test, 'id' | 'title' | 'fullSubtitle' | 'startDate' | 'endDate'>,
  ) =>
    router.push({
      pathname: '/disciplines/[disciplineId]/[quizId]',
      params: {
        disciplineId: disciplineId as string,
        disciplineTitle: disciplineTitle as string,
        quizId: test.id,
        quizzTitle: test.title,
        quizzSubtitle: test.fullSubtitle,
        quizzStartDate: test.startDate,
        quizzEndDate: test.endDate,
      },
    });

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const userId = (await storageService.getUser())?._id;
      if (!userId) throw new Error('User ID not found');

      const testsAvailable = await userService.getSubjectTests(
        disciplineId as string,
        idOfThePermissionToSeeTests,
        userId,
      );

      const formattedAvailableTests: Test[] = testsAvailable.map(test => {
        const fullSubtitle = test.instructions ?? '{{ Sem instruções }}';
        const short =
          fullSubtitle.length > 21
            ? fullSubtitle.slice(0, 21) + '…'
            : fullSubtitle;
        return {
          id: test.id,
          title: test.title,
          subtitle: short,
          fullSubtitle,
          startDate: test.initialDate,
          endDate: test.endDate,
          endingSoon: isEndingSoon(test.endDate),
        };
      });

      setAvailableTests(
        formattedAvailableTests.sort((a, b) =>
          a.endingSoon && !b.endingSoon
            ? -1
            : !a.endingSoon && b.endingSoon
              ? 1
              : 0,
        ),
      );
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [disciplineId, idOfThePermissionToSeeTests]);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchGradedTests = useCallback(async () => {
    try {
      const userId = (await storageService.getUser())?._id;
      if (!userId) throw new Error('User ID not found');
      const finishedTestsApplicationsResponse =
        await userService.getGradedTestApplicationsByStudentId({
          entityId: disciplineId as string,
          actionId: idOfThePermissionToSeeTests,
          studentId: userId,
        });

      const finishedTestsApplications: FinishedTest[] =
        finishedTestsApplicationsResponse.map(testApplications => ({
          id: testApplications.id,
          endedAt: formatDate(testApplications.test.endDate),
          startedAt: formatDate(testApplications.test.initialDate),
          title: testApplications.test.title,
          score: testApplications.grade,
          maxScore: 10,
        }));

      setFinishedTests(finishedTestsApplications);
    } catch (error) {
      console.error('Error fetching graded tests:', error);
      setError('Erro ao carregar provas concluídas.');
    }
  }, [disciplineId, idOfThePermissionToSeeTests]);

  useEffect(() => {
    fetchGradedTests();
  }, [fetchGradedTests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll();
    fetchGradedTests();
  }, [fetchAll, fetchGradedTests]);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
      fetchGradedTests();
    }, [fetchAll, fetchGradedTests]),
  );

  const renderAvailableTests = ({ item }: { item: Test }) => (
    <AppCard
      title={item.title}
      subtitle={
        item.subtitle + (item.endingSoon ? ' - Finaliza em 1 hora' : '')
      }
      onPress={() => handleQuizzPress(item)}
      className={item.endingSoon ? 'border-2 border-red-500' : ''}
    />
  );

  const renderFinishedTests = ({ item }: { item: FinishedTest }) => (
    <FinishedExamCard
      title={item.title}
      score={`${item.score}/${item.maxScore}`}
      startedAt={item.startedAt}
      endedAt={item.endedAt}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        <View className="flex-row items-center gap-3">
          <AppBackButton
            label={`${disciplineTitle}`}
            labelClassName="ml-2 text-3xl font-bold text-primary"
            onPress={() => router.replace('/disciplines')}
          />
        </View>

        <TabHeader active={activeTab} onChange={setActiveTab} />

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : error ? (
          <Text className="my-4 text-center text-red-500">{error}</Text>
        ) : activeTab === 'available' ? (
          <FlatList
            data={availableTests}
            keyExtractor={t => t.id}
            renderItem={renderAvailableTests}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingBottom: 24 }}
            ListEmptyComponent={
              <Text className="my-4 text-center text-gray-500">
                Não há atividades disponíveis.
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6200ee']}
                tintColor="#6200ee"
              />
            }
          />
        ) : (
          <FlatList
            data={finishedTests}
            keyExtractor={t => t.id}
            renderItem={renderFinishedTests}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingBottom: 24 }}
            ListEmptyComponent={
              <Text className="my-4 text-center text-gray-500">
                Nenhuma prova concluída ainda
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6200ee']}
                tintColor="#6200ee"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
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
import { TabHeader } from './components/tabHeader';
import { getFinishedSubjectTestsMock } from './mocks/finishedTests';

type Test = {
  id: string;
  title: string;
  subtitle?: string;
  fullSubtitle?: string;
  startDate: string;
  endDate: string;
  endingSoon?: boolean;
};

type FinishedTest = {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  startedAt: string;
  endedAt: string;
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

  const fetchAll = async () => {
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

      // aqui faz a req para as provas concluídas
      // (não sei se tem essa rota ou se ja vem junto com a outra)
      const finishedTests = await getFinishedSubjectTestsMock();

      const formattedFinishedTests: FinishedTest[] = finishedTests.map(
        test => ({
          id: test.id,
          title: test.title,
          score: test.score,
          maxScore: test.maxScore,
          startedAt: test.startedAt,
          endedAt: test.endedAt,
        }),
      );

      setAvailableTests(
        formattedAvailableTests.sort((a, b) =>
          a.endingSoon && !b.endingSoon
            ? -1
            : !a.endingSoon && b.endingSoon
              ? 1
              : 0,
        ),
      );
      setFinishedTests(formattedFinishedTests);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll();
  }, [disciplineId]);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [disciplineId]),
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

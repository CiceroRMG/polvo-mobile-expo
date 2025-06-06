import { router, useLocalSearchParams } from 'expo-router';
import { CalendarBlank, CalendarCheck, Clock } from 'phosphor-react-native';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { AppBackButton } from '~/components/app/AppBackButton';
import { AppButton } from '~/components/app/AppButton';
import { AppModal } from '~/components/app/AppModal';
import { Monitoring } from '~/components/app/Monitoring';
import { useCountdown } from '~/hooks/useCountdown';
import { storageService } from '~/lib/services/storage';
import { userService } from '~/lib/services/user';
import { useColorScheme } from '~/lib/useColorScheme';

interface QuizData {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  instructions?: string;
  status?: string;
}

export default function QuizDetail() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const idOfThePermissionToSeeTests =
    process.env.EXPO_PUBLIC_API_SEE_TESTS_PERMISSION ?? '';

  const {
    quizId,
    disciplineId,
    quizzTitle,
    quizzSubtitle,
    quizzStartDate,
    quizzEndDate,
    refresh,
    disciplineTitle,
  } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#fafafa' : '#1A1C29';
  const [modalVisible, setModalVisible] = useState(false);

  const timeRemaining = useCountdown(quizData?.endDate);

  const handleConfirm = () => {
    markTestAsInProgress()
      .then(() => {
        setModalVisible(false);
      })
      .catch(err => {
        console.error('Error marking test as in progress:', err);
        setError('Erro ao iniciar o quiz. Tente novamente mais tarde.');
      });

    router.push({
      pathname: '/disciplines/[disciplineId]/[quizId]/execute',
      params: {
        disciplineId: disciplineId as string,
        testApplicationId: quizData?.id as string,
        quizId: quizId as string,
        endDate: quizData?.endDate,
        quizzTitle,
        quizzSubtitle,
        quizzStartDate,
        quizzEndDate,
        refresh,
        disciplineTitle,
        quizStatus: quizData?.status,
      },
    });
  };

  const markTestAsInProgress = async () => {
    try {
      const student = await storageService.getUser();
      const studentId = student?.id || '';

      await userService.markStudentTestApplicationAsInProgress({
        entityId: disciplineId as string,
        actionId: idOfThePermissionToSeeTests as string,
        studentId: studentId as string,
        testApplicationId: quizData?.id as string,
      });
    } catch (error) {
      console.error('Failed to mark test as in progress:', error);
      setError('Erro ao iniciar o quiz. Tente novamente mais tarde.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não disponível';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  };

  useEffect(() => {
    if (refresh === 'true') {
      router.setParams({ refresh: '' });
    }
  }, [refresh]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const student = await storageService.getUser();
        const studentId = student?.id || '';

        const idOfThePermissionToSeeTests =
          process.env.EXPO_PUBLIC_API_SEE_TESTS_PERMISSION ?? '';

        const testDetails = await userService.getTestDetails({
          entityId: disciplineId as string,
          actionId: idOfThePermissionToSeeTests,
          studentId: studentId,
          testId: quizId as string,
        });

        setQuizData({
          id: testDetails.id,
          title: quizzTitle as string,
          // Isso aqui ta ilegivel, mas é o que temos por enquanto
          description: `1) Permita o acesso a camera para o Polvo.

2) Instruções:
    ${quizzSubtitle as string}`,
          startDate: (quizzStartDate as string) ?? '',
          endDate: (quizzEndDate as string) ?? '',
          instructions: 'Instruções para o quiz',
          status: testDetails.status,
        });

        await storageService.saveQuestions(testDetails.questions);
      } catch (err) {
        console.error('Failed to fetch quiz data:', err);
        setError(
          'Erro ao carregar os dados do quiz. Tente novamente mais tarde.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [disciplineId, quizId]);

  return (
    <View className="flex-1 bg-background">
      <View className="w-full flex-1 px-6">
        <View className="flex-row items-center gap-3">
          <AppBackButton
            label={(quizzTitle as string) || 'Quiz'}
            labelClassName="text-3xl font-bold text-primary ml-2"
            onPress={() =>
              router.navigate({
                pathname: '/disciplines/[disciplineId]',
                params: {
                  disciplineId: disciplineId as string,
                  disciplineTitle: disciplineTitle as string,
                },
              })
            }
          />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6200ee" className="mt-10" />
        ) : error ? (
          <Text className="my-4 text-center text-red-500">{error}</Text>
        ) : (
          <View className="gap-10">
            <View className="gap-1">
              <Text className="mb-2 ml-2 text-xl font-semibold text-primary">
                Descrição / Orientação
              </Text>

              <Text className="mb-2 ml-2 text-base font-normal text-primary">
                {quizData?.description ||
                  quizData?.instructions ||
                  'Sem descrição disponível para esta atividade.'}
              </Text>
            </View>

            <View className="gap-6">
              <View className="flex-row items-center gap-2">
                <CalendarBlank size={24} color={iconColor} />
                <Text className="text-base font-normal text-primary">
                  Data de Início:
                </Text>
                <Text className="text-base font-normal text-main-textPurple">
                  {formatDate(quizData?.startDate)}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <CalendarCheck size={24} color={iconColor} />
                <Text className="text-base font-normal text-primary">
                  Data de Entrega:
                </Text>
                <Text className="text-base font-normal text-main-textPurple">
                  {formatDate(quizData?.endDate)}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Clock size={24} color={iconColor} />
                <Text className="text-base font-normal text-primary">
                  Tempo restante:
                </Text>
                <Text
                  className={`text-base font-medium ${
                    timeRemaining === 'Prazo encerrado'
                      ? 'text-red-500'
                      : 'text-main-textPurple'
                  }`}
                >
                  {timeRemaining}
                </Text>
              </View>

              {/* Add test status indicator with appropriate styling */}
              <View
                className={`flex-row items-center rounded-lg p-3 ${
                  quizData?.status === 'completed'
                    ? 'bg-green-100'
                    : quizData?.status === 'in-progress'
                      ? 'bg-yellow-100'
                      : 'bg-gray-100'
                }`}
              >
                {quizData?.status === 'completed' ? (
                  <>
                    <View className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                    <Text className="text-base font-medium text-green-700">
                      Teste finalizado
                    </Text>
                  </>
                ) : quizData?.status === 'in-progress' ? (
                  <>
                    <View className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />
                    <Text className="text-base font-medium text-yellow-700">
                      Teste em andamento
                    </Text>
                  </>
                ) : (
                  <>
                    <View className="mr-2 h-3 w-3 rounded-full bg-gray-500" />
                    <Text className="text-base font-medium text-gray-700">
                      Teste não iniciado
                    </Text>
                  </>
                )}
              </View>
            </View>

            {!['completed', 'graded'].includes(quizData?.status ?? '') &&
              permissionsGranted && (
                <AppButton
                  className="mt-4 w-40 py-2"
                  onPress={
                    quizData?.status === 'no-started'
                      ? () => setModalVisible(true)
                      : handleConfirm
                  }
                >
                  {quizData?.status === 'no-started' ? 'Começar' : 'Continuar'}
                </AppButton>
              )}

            {!['completed', 'graded'].includes(quizData?.status ?? '') &&
              !permissionsGranted && (
                <Text className="mt-4 text-center font-medium text-amber-600">
                  Por favor, permita acesso à câmera e microfone para iniciar a
                  prova
                </Text>
              )}

            <Monitoring
              onPermissionsChange={granted => setPermissionsGranted(granted)}
            />
          </View>
        )}
      </View>

      <AppModal
        visible={modalVisible}
        title="Iniciar Atividade"
        message="Tem certeza que deseja começar o quiz agora?"
        onPress={handleConfirm}
        onClose={() => setModalVisible(false)}
        confirmText="Iniciar"
        showCloseButton={true}
      />
    </View>
  );
}

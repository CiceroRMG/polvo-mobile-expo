import { router, useLocalSearchParams } from 'expo-router';
import { CalendarBlank, CalendarCheck } from 'phosphor-react-native';
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { AppBackButton } from '~/components/app/AppBackButton';
import { AppButton } from '~/components/app/AppButton';
import { AppModal } from '~/components/app/AppModal';
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
}

export default function QuizDetail() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const { quizId, disciplineId, quizzTitle } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#fafafa' : '#1A1C29';
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    router.push(`/disciplines/${disciplineId}/${quizId}/execute`);
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
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const student = await storageService.getUser();
        const studentId = student?.id || '';

        const idOfThePermissionToSeeTests =
          process.env.EXPO_PUBLIC_API_SEE_TESTS_PERMISSION ?? '';

        const testDetails = await userService.getUserEnteredTest({
          entityId: disciplineId as string,
          actionId: idOfThePermissionToSeeTests,
          studentId: studentId,
          testId: quizId as string,
        });

        // MOCK
        setQuizData({
          id: testDetails.id,
          title: quizzTitle as string,
          description: 'Descrição do quiz',
          startDate: '2023-10-01T00:00:00Z',
          endDate: '2023-10-10T00:00:00Z',
          instructions: 'Instruções para o quiz',
        });
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
            </View>

            <AppButton
              className="mt-4 w-40 py-2"
              onPress={() => setModalVisible(true)}
            >
              Começar
            </AppButton>
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

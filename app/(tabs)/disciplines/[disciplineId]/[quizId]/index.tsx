import { router, useLocalSearchParams } from 'expo-router';
import { CalendarBlank, CalendarCheck } from 'phosphor-react-native';
import * as React from 'react';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppBackButton } from '~/components/app/AppBackButton';
import { AppButton } from '~/components/app/AppButton';
import { AppModal } from '~/components/app/AppModal';
import { useColorScheme } from '~/lib/useColorScheme';

export default function QuizDetail() {
  const { quizId, disciplineId } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#fafafa' : '#1A1C29';
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    router.push(`/disciplines/${disciplineId}/${quizId}/execute`);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="w-full flex-1 px-6">
        <View className="flex-row items-center gap-3">
          <AppBackButton
            label={`Id do Quiz: ${quizId}`}
            labelClassName="text-3xl font-bold text-primary ml-2"
          />
        </View>

        <View className="gap-10">
          <View className="gap-1">
            <Text className="mb-2 ml-2 text-xl font-semibold text-primary">
              Descrição / Orientação genérica
            </Text>

            <Text className="mb-2 ml-2 text-base font-normal text-primary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>

          <View className="gap-6">
            <View className="flex-row items-center gap-2">
              <CalendarBlank size={24} color={iconColor} />
              <Text className="text-base font-normal text-primary">
                Data de Início:
              </Text>
              <Text className="text-base font-normal text-main-textPurple">
                20 de Abril de 2025
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <CalendarCheck size={24} color={iconColor} />
              <Text className="text-base font-normal text-primary">
                Data de Entrega:
              </Text>
              <Text className="text-base font-normal text-main-textPurple">
                20 de Abril de 2025
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

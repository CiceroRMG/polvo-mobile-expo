import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';

import { AppButton } from '~/components/app/AppButton';
import { useAuth } from '~/lib/auth/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 py-10">
          <Text className="mb-6 text-3xl font-bold text-primary">
            Bem-vindo, {user?.name}!
          </Text>

          <View className="mb-6 rounded-xl bg-card p-4">
            <Text className="mb-2 text-lg text-primary">
              Informações do Usuário:
            </Text>
            <Text className="text-primary">
              Nome: {user?.name} {user?.surname}
            </Text>
            <Text className="text-primary">Email: {user?.email}</Text>
            <Text className="text-primary">
              Matrícula: {user?.matriculation}
            </Text>
            <Text className="text-primary">
              Documento: {user?.document?.documentType} -{' '}
              {user?.document?.documentNumber}
            </Text>
          </View>

          <AppButton
            className="native:h-[60px] mt-4 w-full items-center justify-center rounded-2xl bg-main-purple px-6"
            onPress={handleLogout}
          >
            Sair
          </AppButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

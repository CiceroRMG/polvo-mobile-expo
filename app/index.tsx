import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '~/lib/auth/AuthContext';
import { AppButton } from '~/components/app/AppButton';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 py-10">
          <Text className="text-3xl font-bold text-primary mb-6">Bem-vindo, {user?.name}!</Text>
          
          <View className="bg-card rounded-xl p-4 mb-6">
            <Text className="text-primary text-lg mb-2">Informações do Usuário:</Text>
            <Text className="text-primary">Nome: {user?.name} {user?.surname}</Text>
            <Text className="text-primary">Email: {user?.email}</Text>
            <Text className="text-primary">Matrícula: {user?.matriculation}</Text>
            <Text className="text-primary">Documento: {user?.document?.documentType} - {user?.document?.documentNumber}</Text>
          </View>
          
          <AppButton
            className="w-full px-6 rounded-2xl bg-main-purple justify-center items-center native:h-[60px] mt-4"
            onPress={handleLogout}
          >
            Sair
          </AppButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import * as React from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';

import logoBlack from '~/assets/images/logo-black.svg';
import logoWhite from '~/assets/images/logo-white.svg';
import { AppModal } from '~/components/app/AppModal';
import { useAuth } from '~/lib/auth/AuthContext';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Settings() {
  const { logout } = useAuth();
  const { colorScheme } = useColorScheme();
  const logoSource = colorScheme === 'dark' ? logoWhite : logoBlack;
  const arrowIconColorLogout = colorScheme === 'dark' ? '#dc2828' : '#ef4444';
  const arrowIconColor = colorScheme === 'dark' ? '#fafafa' : '#797979';

  const [modalVisible, setModalVisible] = React.useState(false);

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = () => {
    setModalVisible(false);
    logout();
  };

  return (
    <ScrollView className="flex-1">
      <View className="flex-1 px-6">
        <View className="mb-7 flex-row items-center justify-start">
          <View>
            <Image source={logoSource} style={{ width: 50, height: 50 }} />
          </View>
          <Text className="pt-1 text-4xl font-bold text-main-logo">Polvo</Text>
        </View>

        <Text className="mb-6 text-3xl font-bold text-primary">
          Configurações
        </Text>

        <View className="flex-1">
          <Pressable
            onPress={() => router.push('/drive')}
            className="w-full flex-row items-center justify-between border-b-[0.5px] border-main-inputText px-4 py-6"
          >
            <Text className="text-base font-normal text-primary">
              Trocar Senha
            </Text>
            <CaretRight size={20} color={arrowIconColor} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/drive')}
            className="w-full flex-row items-center justify-between border-b-[0.5px] border-main-inputText px-4 py-6"
          >
            <Text className="text-base font-normal text-primary">
              Aparência
            </Text>
            <CaretRight size={20} color={arrowIconColor} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/drive')}
            className="w-full flex-row items-center justify-between border-b-[0.5px] border-main-inputText px-4 py-6"
          >
            <Text className="text-base font-normal text-primary">Contato</Text>
            <CaretRight size={20} color={arrowIconColor} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/drive')}
            className="w-full flex-row items-center justify-between border-b-[0.5px] border-main-inputText px-4 py-6"
          >
            <Text className="text-base font-normal text-primary">Idioma</Text>
            <CaretRight size={20} color={arrowIconColor} />
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="w-full flex-row items-center justify-between px-4 py-6"
          >
            <Text className="text-base font-normal text-destructive">Sair</Text>
            <CaretRight size={20} color={arrowIconColorLogout} />
          </Pressable>
        </View>
      </View>
      <AppModal
        visible={modalVisible}
        title="Sair da conta"
        message="Tem certeza que deseja sair da sua conta?"
        onClose={() => setModalVisible(false)}
        onPress={confirmLogout}
        confirmText="Sair"
        showCloseButton={true}
      />
    </ScrollView>
  );
}

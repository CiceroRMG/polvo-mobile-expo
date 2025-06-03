import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { CameraView } from 'expo-camera';
import { useState, FC, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';

export const Monitoring: FC = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  // Forçando sempre a câmera frontal
  const [isActive, setIsActive] = useState<boolean>(false);

  // Ativar a câmera após a montagem do componente
  useEffect(() => {
    // Pequeno atraso para garantir que a câmera inicialize corretamente
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!cameraPermission || !microphonePermission) {
    return (
      <View className="mt-4 flex-row items-center justify-center rounded-xl bg-background p-4 shadow-sm">
        <ActivityIndicator size="small" color="var(--purple-primary)" />
        <Text className="ml-3 font-medium text-primary">
          Verificando permissões da câmera...
        </Text>
      </View>
    );
  }

  // Handle permission denied cases
  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View className="mt-4 rounded-xl bg-background p-5 shadow-sm">
        <View className="mb-4 items-center">
          <Text className="text-lg font-bold text-primary">
            Permissão Necessária
          </Text>
        </View>

        <Text className="mb-4 text-center text-muted-foreground">
          O Polvo precisa acessar sua câmera e microfone para monitoramento das
          provas.
        </Text>

        <View className="flex-row justify-center">
          <TouchableOpacity
            className="mr-3 rounded-lg bg-main-purple px-5 py-2.5 shadow-sm"
            onPress={() => {
              requestCameraPermission();
              requestMicrophonePermission();
            }}
          >
            <Text className="text-sm font-medium text-white">
              Permitir Acesso
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-lg border border-main-borderColor bg-secondary px-5 py-2.5"
            onPress={() => {
              Alert.alert(
                'Permissões Necessárias',
                'O Polvo precisa acessar sua câmera e microfone para monitoramento. Por favor, habilite estas permissões nas configurações do seu dispositivo.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Abrir Configurações',
                    onPress: () => {
                      if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                      } else {
                        Linking.openSettings();
                      }
                    },
                  },
                ],
              );
            }}
          >
            <Text className="text-sm font-medium text-primary">
              Configurações
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-4 overflow-hidden rounded-xl border border-main-borderColor shadow-sm">
      <View className="flex-row items-center bg-background p-2">
        <View className="mr-3 h-14 w-14 overflow-hidden rounded-lg border border-main-borderColor">
          {isActive && (
            <CameraView
              facing="front"
              className="flex-1"
              ratio="1:1"
              active={true}
              onMountError={error => {
                console.error('Erro na montagem da câmera:', error);
              }}
            />
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-center">
            <View className="mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <Text className="font-medium text-primary">
              Monitoramento Ativo
            </Text>
          </View>
          <Text className="mt-1 text-xs text-muted-foreground">
            Sua câmera está sendo usada para monitorar a prova
          </Text>
        </View>
      </View>

      <View className="h-0 overflow-hidden">
        {isActive && (
          <CameraView
            facing="front"
            className="flex-1"
            ratio="16:9"
            active={true}
          />
        )}
      </View>
    </View>
  );
};

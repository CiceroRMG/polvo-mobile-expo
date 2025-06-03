import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { CameraView } from 'expo-camera';
import { useState, FC, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

interface MonitoringProps {
  onPermissionsChange?: (granted: boolean) => void;
}

export const Monitoring: FC<MonitoringProps> = ({ onPermissionsChange }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  const mountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (cameraPermission && microphonePermission) {
      const granted = cameraPermission.granted && microphonePermission.granted;
      onPermissionsChange?.(granted);
    }
  }, [cameraPermission, microphonePermission, onPermissionsChange]);

  useEffect(() => {
    mountTimeoutRef.current = setTimeout(() => {
      setIsActive(true);
    }, 1000);
    return () => {
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current);
      }
    };
  }, []);

  // Verificar permissões
  if (!cameraPermission || !microphonePermission) {
    return (
      <View
        className="mt-4 flex-row items-center justify-center rounded-xl bg-background p-4"
        style={styles.cardShadow}
      >
        <ActivityIndicator size="small" color="var(--purple-primary)" />
        <Text className="ml-3 font-medium text-primary">
          Verificando permissões da câmera...
        </Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View
        className="mt-4 rounded-xl bg-background p-5"
        style={styles.cardShadow}
      >
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
            className="mr-3 rounded-lg bg-main-purple px-5 py-2.5"
            style={styles.buttonShadow}
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

  if (cameraError) {
    return (
      <View className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
        <Text className="font-medium text-red-700">
          Erro na câmera: {cameraError}
        </Text>
        <TouchableOpacity
          className="mt-2 rounded-lg bg-red-100 p-2"
          onPress={() => {
            setCameraError(null);
            setIsActive(true);
          }}
        >
          <Text className="text-center text-red-700">Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View
      className="overflow-hidden rounded-xl border border-main-borderColor bg-white"
      style={styles.cardShadow}
    >
      <View className="p-4">
        {/* Header with status */}
        <View className="mb-3 flex-row items-center">
          <View
            className="mr-2.5 h-2.5 w-2.5 rounded-full bg-red-500"
            style={styles.pulseIndicator}
          />
          <Text className="font-medium text-primary">
            Monitoramento {cameraReady ? 'Ativo' : 'Inicializando...'}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View
            className="aspect-square h-56 w-56 overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50"
            style={styles.cameraContainer}
          >
            {isActive ? (
              <CameraView
                facing={'front'}
                ratio="1:1"
                style={{ flex: 1 }}
                mode="contain"
                onCameraReady={() => {
                  console.log('Câmera pronta!');
                  setCameraReady(true);
                }}
                onMountError={error => {
                  console.error('Erro na montagem da câmera:', error);
                  setCameraError(error?.message || 'Erro desconhecido');
                  setIsActive(false);
                }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#8B5CF6" />
              </View>
            )}
          </View>

          <View className="ml-4 flex-1">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Status:{' '}
              <Text
                className={`font-semibold ${cameraReady ? 'text-green-600' : 'text-amber-600'}`}
              >
                {cameraReady ? 'Câmera Ativa' : 'Inicializando...'}
              </Text>
            </Text>

            <Text className="mb-3 text-xs text-muted-foreground">
              Sua câmera está sendo usada para monitorar a prova. Por favor,
              mantenha seu rosto visível.
            </Text>

            {cameraReady && (
              <View className="flex-row">
                <View className="mr-1 h-1 w-1 rounded-full bg-green-500" />
                <View className="mr-1 h-1 w-1 rounded-full bg-green-500" />
                <View className="h-1 w-1 rounded-full bg-green-500" />
              </View>
            )}
          </View>
        </View>

        {/* Footer note */}
        <Text className="mt-3 text-xs italic text-gray-400">
          O monitoramento será ativado automaticamente durante toda a avaliação
        </Text>
      </View>
    </View>
  );
};

// Move shadow styles to StyleSheet to fix the issues
const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  cameraContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  pulseIndicator: {
    // Animation will need to be handled with Animated API instead of CSS
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});

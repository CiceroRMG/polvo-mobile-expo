import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { CameraView, CameraType } from 'expo-camera';
import { useState, FC } from 'react';
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
  // Use the new hooks for permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  // Camera state
  const [facing, setFacing] = useState<CameraType>('back');

  // Check if permissions are still loading
  if (!cameraPermission || !microphonePermission) {
    return (
      <View className="mt-4 flex-row items-center rounded-lg bg-gray-100 px-4 py-2">
        <ActivityIndicator size="small" color="#4338CA" />
        <Text className="ml-2 text-gray-700">
          Checking camera permissions...
        </Text>
      </View>
    );
  }

  // Handle permission denied cases
  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View className="mt-4 rounded-lg bg-red-100 px-4 py-3">
        <Text className="mb-2 font-medium text-red-800">
          Camera and microphone permissions are required for monitoring.
        </Text>
        <View className="flex-row">
          <TouchableOpacity
            className="mr-2 rounded-md bg-red-500 px-3 py-1"
            onPress={() => {
              requestCameraPermission();
              requestMicrophonePermission();
            }}
          >
            <Text className="text-sm text-white">Grant Access</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-md bg-gray-300 px-3 py-1"
            onPress={() => {
              Alert.alert(
                'Permissions Required',
                'Camera and microphone permissions are required for monitoring. Please enable them in your device settings.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Open Settings',
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
            <Text className="text-sm text-gray-800">Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Toggle camera facing
  const toggleCameraFacing = (): void => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // All permissions granted, show camera UI
  return (
    <View className="mt-4 h-20 overflow-hidden rounded-lg">
      <CameraView facing={facing} className="flex-1" ratio="16:9">
        <View className="flex-1 bg-transparent">
          <TouchableOpacity
            className="absolute right-2 top-2 rounded-full bg-black/30 p-1"
            onPress={toggleCameraFacing}
          >
            <Text className="text-xs text-white">Flip</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

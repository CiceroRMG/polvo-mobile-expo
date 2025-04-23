import { Stack } from 'expo-router';

export default function QuizDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="execute" />
    </Stack>
  );
}

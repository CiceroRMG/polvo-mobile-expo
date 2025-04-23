import { Tabs } from 'expo-router';
import { useSegments } from 'expo-router';
import { Books, GoogleDriveLogo, Envelope, Gear } from 'phosphor-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '~/lib/useColorScheme';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#D4D6DD' : '#797979';
  const tabBarStyle = {
    backgroundColor: isDark ? '#292E32' : '#FFFFFF',
    borderTopColor: '#D4D6DD',
    height: 55,
    borderTopWidth: 0.5,
    paddingTop: 10,
    shadowColor: 'transparent',
  };

  // Detecta se está em uma tela de execução de quiz
  const segments = useSegments();
  const hideTabBar = segments.includes('execute' as never);

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'shift',
          tabBarStyle: hideTabBar ? { display: 'none' } : { ...tabBarStyle },
          tabBarShowLabel: false,
          tabBarLabelStyle: {
            display: 'none',
          },
          tabBarButton: props => {
            const { delayLongPress, ...touchableProps } = props;
            return (
              <TouchableOpacity
                {...touchableProps}
                activeOpacity={1}
                delayLongPress={delayLongPress ?? undefined}
              />
            );
          },
        }}
      >
        <Tabs.Screen
          name="disciplines"
          options={{
            title: 'Disciplinas',
            tabBarIcon: ({ focused }) => (
              <Books
                size={30}
                color={focused ? (isDark ? '#6363F2' : '#6365F2') : iconColor}
                weight={focused ? 'duotone' : 'light'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="drive"
          options={{
            title: 'Drive',
            tabBarIcon: ({ focused }) => (
              <GoogleDriveLogo
                size={30}
                color={focused ? (isDark ? '#6363F2' : '#6365F2') : iconColor}
                weight={focused ? 'regular' : 'light'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="emails"
          options={{
            title: 'E‑mails',
            tabBarIcon: ({ focused }) => (
              <Envelope
                size={30}
                color={focused ? (isDark ? '#6363F2' : '#6365F2') : iconColor}
                weight={focused ? 'regular' : 'light'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Configurações',
            tabBarIcon: ({ focused }) => (
              <Gear
                size={30}
                color={focused ? (isDark ? '#6363F2' : '#6365F2') : iconColor}
                weight={focused ? 'regular' : 'light'}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

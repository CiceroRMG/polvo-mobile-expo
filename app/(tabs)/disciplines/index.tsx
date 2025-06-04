import { router, useFocusEffect } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { AppCard } from '~/components/app/AppCard';
import { userService } from '~/lib/services/user';

interface Subjects {
  id: string;
  title: string;
  subtitle?: string;
}

const handleDisciplinePress = (
  disciplineId: string,
  disciplineTitle: string,
) => {
  router.push({
    pathname: '/disciplines/[disciplineId]',
    params: { disciplineId, disciplineTitle },
  });
};

export default function Disciplines() {
  const [entities, setEntities] = useState<Subjects[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubjects = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);

      const response = await userService.getUserEnrolledSubjects();

      if (Array.isArray(response)) {
        const formattedEntities: Subjects[] = response.map(entity => ({
          id: entity.id || entity.id,
          title: entity.title || '',
          subtitle: entity.testCount + ' provas ativas',
        }));

        setEntities(formattedEntities);
      } else {
        console.error('Unexpected response format:', response);
        setError('Formato de resposta inválido.');
      }
    } catch (err) {
      console.error('Failed to fetch entities:', err);
      setError('Falha ao carregar as disciplinas tente novamente.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSubjects(false);
  }, [fetchSubjects]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useFocusEffect(
    useCallback(() => {
      fetchSubjects(false);
    }, [fetchSubjects]),
  );

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-6">
        <Text className="mb-6 text-3xl font-bold text-primary">
          Suas Disciplinas
        </Text>
        <Text className="mb-2 ml-2 text-xl font-semibold text-main-purple">
          Ativas
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : error ? (
          <Text className="my-4 text-center text-red-500">{error}</Text>
        ) : (
          <FlatList
            data={entities}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <AppCard
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => handleDisciplinePress(item.id, item.title)}
              />
            )}
            contentContainerStyle={{
              paddingBottom: 24,
              gap: 14,
            }}
            ListEmptyComponent={
              <Text className="my-4 text-center text-gray-500">
                No active disciplines found.
              </Text>
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6200ee']}
                tintColor="#6200ee"
              />
            }
          />
        )}

        <View className="mb-8 mt-8 items-end justify-end px-2">
          <Pressable
            onPress={() => router.push('/drive')}
            className="w-full flex-row items-center justify-between"
          >
            <Text className="text-base font-normal text-main-inputText">
              Inativas
            </Text>
            <CaretRight size={20} color="#797979" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { User } from '../auth/AuthContext';
import { tokenManager } from '../auth/tokenManager';
import { STORAGE_KEYS } from '../enums/storageKeys';

import { Question } from './types/user';

/* export const STORAGE_KEYS = {
  USER_DATA: '@polvo-app:user-data',
  AUTH_TOKEN: 'polvoappauthkey',
  ACCESS_KEY: 'polvoappaccesskey',
}; */

export const storageService = {
  async saveQuestions(questionsData: Question[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.QUIZ_QUESTIONS.toString(),
      JSON.stringify(questionsData),
    );
  },

  async getQuizQuestions(): Promise<Question[] | null> {
    const raw = await AsyncStorage.getItem(
      STORAGE_KEYS.QUIZ_QUESTIONS.toString(),
    );
    return raw ? JSON.parse(raw) : null;
  },
  // User data operations
  async saveUser(userData: User): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA.toString(),
      JSON.stringify(userData),
    );
    await this.saveTokens(userData.authenticationKey, userData.accessKey);
  },

  async getUser(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA.toString());
    return raw ? JSON.parse(raw) : null;
  },

  // Token operations
  async saveTokens(authToken: string, accessKey: string): Promise<void> {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.AUTH_TOKEN.toString(),
      authToken,
    );
    await SecureStore.setItemAsync(
      STORAGE_KEYS.ACCESS_KEY.toString(),
      accessKey,
    );

    // Update token manager
    tokenManager.setAuthToken(authToken);
    tokenManager.setAccessKey(accessKey);
  },

  async getTokens(): Promise<{
    authToken: string | null;
    accessKey: string | null;
  }> {
    const authToken = await SecureStore.getItemAsync(
      STORAGE_KEYS.AUTH_TOKEN.toString(),
    );
    const accessKey = await SecureStore.getItemAsync(
      STORAGE_KEYS.ACCESS_KEY.toString(),
    );
    return { authToken, accessKey };
  },

  // Clear all data
  async clearStorage(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA.toString());
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN.toString());
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_KEY.toString());
    tokenManager.clearTokens();
  },

  // General storage methods
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

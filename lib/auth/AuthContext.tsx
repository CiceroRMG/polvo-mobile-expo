import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import api from '../api';

import { tokenManager } from './tokenManager';

export const STORAGE_KEYS = {
  USER_DATA: '@polvo-app:user-data',
  AUTH_TOKEN: 'polvoappauthkey',
  ACCESS_KEY: 'polvoappaccesskey',
};

export interface User {
  _id: string;
  id: string;
  name: string;
  surname: string;
  birthday: number;
  email: string;
  matriculation: string;
  document: {
    _id: string;
    documentType: string;
    documentNumber: string;
  };
  drive: {
    canUpdate: boolean;
  };
  authenticationKey: string;
  accessKey: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carrega dados do usuário ao iniciar
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        const access = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_KEY);

        if (raw && token && access) {
          const storedUser: User = JSON.parse(raw);
          setUser(storedUser);

          tokenManager.setAuthToken(token);
          tokenManager.setAccessKey(access);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (login: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/api/login/hoken`, { login, password });
      if (data.success && data.data) {
        const userData: User = data.data;

        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData),
        );
        await SecureStore.setItemAsync(
          STORAGE_KEYS.AUTH_TOKEN,
          userData.authenticationKey,
        );
        await SecureStore.setItemAsync(
          STORAGE_KEYS.ACCESS_KEY,
          userData.accessKey,
        );

        tokenManager.setAuthToken(userData.authenticationKey);
        tokenManager.setAccessKey(userData.accessKey);

        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_KEY);

      tokenManager.clearTokens();
      setUser(null);
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

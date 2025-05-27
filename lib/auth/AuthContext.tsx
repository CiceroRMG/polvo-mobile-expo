import { useRouter } from 'expo-router';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { authService } from '../services/auth';
import { storageService } from '../services/storage';

// Keep your User interface definition
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

  // Initialize user data from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await storageService.getUser();
        const { authToken, accessKey } = await storageService.getTokens();

        if (storedUser && authToken && accessKey) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (login: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login({ login, password });

      if (result.success && result.data) {
        const userData: User = result.data;
        await storageService.saveUser(userData);
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
      await storageService.clearStorage();
      setUser(null);
      router.replace('/login');
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

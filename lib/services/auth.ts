import api from '../api';

interface LoginProps {
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginProps) {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },
};

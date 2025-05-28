import api from '../api';

interface LoginProps {
  login: string;
  password: string;
}

export const authService = {
  async login(data: LoginProps) {
    try {
      const response = await api.post('/login/hoken', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async sendPasswordResetEmail(email: string) {
    try {
      const response = await api.post('/user/resetPassword/token', {
        email,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação de senha:', error);
      throw error;
    }
  },
};

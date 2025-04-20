let authToken: string | null = null;
let accessKey: string | null = null;

// Salva os tokens em memória (evita repetição de chamadas para o AyncStorage/SecureStore)
export const tokenManager = {
  getAuthToken: () => authToken,
  setAuthToken: (token: string | null) => {
    authToken = token;
  },
  getAccessKey: () => accessKey,
  setAccessKey: (key: string | null) => {
    accessKey = key;
  },
  clearTokens: () => {
    authToken = null;
    accessKey = null;
  },
};

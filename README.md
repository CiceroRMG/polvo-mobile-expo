# Polvo App

<div align="center">
  <img src="./assets/images/logo-black.svg" alt="Polvo Logo" width="100" />
</div>

## 📱 Sobre o Projeto

Polvo App é uma aplicação mobile desenvolvida com React Native e Expo para instituições educacionais. A plataforma permite aos alunos acessarem suas disciplinas, realizarem quizzes e atividades, além de gerenciar documentos e comunicações acadêmicas.

## ✨ Principais Funcionalidades

- 🔐 Sistema de login e autenticação
- 📚 Visualização de disciplinas
- 📝 Participação em quizzes/atividades
- 🌓 Suporte a tema claro e escuro
- 📂 Armazenamento de documentos (em breve)
- 📧 Sistema de emails (em breve)

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [NativeWind](https://www.nativewind.dev/) (TailwindCSS para React Native)
- [Expo Router](https://docs.expo.dev/routing/introduction/) (Navegação)
- [React Hook Form](https://react-hook-form.com/) (Formulários)
- [Zod](https://zod.dev/) (Validação)
- [Zustand](https://github.com/pmndrs/zustand) (Gerenciamento de estado)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (Armazenamento local)

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (recomendado v18 ou superior)
- [NPM](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Aplicativo Expo Go instalado no seu dispositivo móvel (iOS ou Android) ou um emulador

### Configuração do Ambiente

1. Clone este repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` com base no `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure a variável `EXPO_PUBLIC_API_URL` no arquivo `.env` com a URL do backend

### Executando o Projeto

```bash
# Iniciar o projeto em modo de desenvolvimento
npm dev

# Executar diretamente no Android
npm dev:android

# Executar diretamente no iOS
npm ios

# Executar na web
npm dev:web
```

Após iniciar o projeto, escaneie o QR code com o aplicativo Expo Go no seu dispositivo móvel ou use um emulador para visualizar a aplicação.

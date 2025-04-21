import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import logoBlack from '~/assets/images/logo-black.svg';
import logoWhite from '~/assets/images/logo-white.svg';
import { AppButton } from '~/components/app/AppButton';
import { AppInput } from '~/components/app/AppInput';
import { AppTextButton } from '~/components/app/AppTextButton';
import { useAuth } from '~/lib/auth/AuthContext';
import { useColorScheme } from '~/lib/useColorScheme';

const loginSchema = z.object({
  login: z.string().min(4, 'Informe sua matrícula, email ou ID Udesc'),
  password: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { colorScheme } = useColorScheme();
  const logoSource = colorScheme === 'dark' ? logoWhite : logoBlack;
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loginError, setLoginError] = useState('');

  const isFormEmpty = !loginValue || !passwordValue;

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('');
    const success = await login(data.login, data.password);
    if (success) {
      router.replace('/disciplines');
    } else {
      setLoginError('Usuário ou senha inválidos');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center gap-10 px-10 pb-24">
            <View className="items-center justify-center gap-2">
              <View>
                <Image source={logoSource} style={{ width: 90, height: 90 }} />
              </View>
              <Text className="text-5xl font-bold text-main-logo">Polvo</Text>
            </View>

            <View className="w-full gap-3">
              <Controller
                name="login"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AppInput
                      className="native:text-base native:h-[60px] w-full rounded-2xl bg-input px-6 text-primary placeholder:text-main-inputText"
                      placeholder="Matrícula, email ou ID Udesc"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onBlur={onBlur}
                      onChangeText={text => {
                        setLoginValue(text);
                        onChange(text);
                        setLoginError('');
                      }}
                      value={value}
                    />
                    {errors.login && (
                      <Animated.View
                        entering={FadeInUp.duration(300).withInitialValues({
                          translateY: -12,
                        })}
                      >
                        <Text className="pl-2 text-sm text-red-500">
                          {errors.login.message}
                        </Text>
                      </Animated.View>
                    )}
                  </>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AppInput
                      className="native:text-base native:h-[60px] w-full rounded-2xl bg-input px-6 text-primary placeholder:text-main-inputText"
                      placeholder="Senha"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={text => {
                        setPasswordValue(text);
                        onChange(text);
                        setLoginError('');
                      }}
                      value={value}
                    />
                    {errors.password && (
                      <Animated.View
                        entering={FadeInUp.duration(300).withInitialValues({
                          translateY: -12,
                        })}
                      >
                        <Text className="pl-2 text-sm text-red-500 ">
                          {errors.password.message}
                        </Text>
                      </Animated.View>
                    )}
                  </>
                )}
              />

              {loginError && (
                <Animated.View
                  entering={FadeInUp.duration(300).withInitialValues({
                    translateY: -12,
                  })}
                >
                  <Text className="py-1 pl-2 text-center text-sm text-red-500">
                    {loginError}
                  </Text>
                </Animated.View>
              )}

              <AppButton
                className="native:h-[60px] w-full items-center justify-center rounded-2xl bg-main-purple px-6"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting || isFormEmpty}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </AppButton>
            </View>

            <AppTextButton
              className="active:opacity-80"
              onPress={() => router.push('/passwordRecovery')}
            >
              Esqueci minha senha
            </AppTextButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

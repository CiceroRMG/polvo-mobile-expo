import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import logoBlack from '~/assets/images/logo-black.svg';
import logoWhite from '~/assets/images/logo-white.svg';
import { useColorScheme } from '~/lib/useColorScheme';
import { AppInput } from '~/components/app/AppInput';
import { AppButton } from '~/components/app/AppButton';
import { AppTextButton } from '~/components/app/AppTextButton';
import { useAuth } from '~/lib/auth/AuthContext';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const loginSchema = z.object({
  login: z
    .string()
    .min(4, 'Informe sua matrícula, email ou ID Udesc'),
  password: z
    .string()
    .min(4, 'A senha deve ter pelo menos 4 caracteres'),
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
      router.replace('/');
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center justify-center px-10 gap-10 pb-24">
            <View className="items-center justify-center gap-2">
              <View >
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
                      className="w-full px-6 rounded-2xl text-primary bg-input native:text-base placeholder:text-main-inputText native:h-[60px]"
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
                        entering={FadeInUp.duration(300).withInitialValues({ translateY: -12 })}
                      >
                        <Text className="text-red-500 text-sm pl-2">
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
                      className="w-full px-6 rounded-2xl text-primary bg-input native:text-base placeholder:text-main-inputText native:h-[60px]"
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
                        entering={FadeInUp.duration(300).withInitialValues({ translateY: -12 })}
                      >
                        <Text className="text-red-500 text-sm pl-2 ">
                          {errors.password.message}
                        </Text>
                      </Animated.View>
                    )}
                  </>
                )}
              />

              {loginError && (
                <Animated.View
                  entering={FadeInUp.duration(300).withInitialValues({ translateY: -12 })}
                >
                  <Text className="text-red-500 text-sm text-center py-1 pl-2">
                    {loginError}
                  </Text>
                </Animated.View>
              )}

              <AppButton
                className="w-full px-6 rounded-2xl bg-main-purple justify-center items-center native:h-[60px]"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting || isFormEmpty}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </AppButton>
            </View>

            <AppTextButton
              className="active:opacity-70"
              onPress={() => router.push('/(auth)/passwordRecovery')}
            >
              Esqueci minha senha
            </AppTextButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

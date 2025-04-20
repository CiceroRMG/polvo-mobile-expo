import { Image } from "expo-image";
import { Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import lockImg from "~/assets/images/lock.svg";
import { AppBackButton } from "~/components/app/AppBackButton";
import { AppButton } from "~/components/app/AppButton";
import { AppInput } from "~/components/app/AppInput";
import { AppTextButton } from "~/components/app/AppTextButton";
import { AppModal } from "~/components/app/AppModal";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated, { FadeInUp } from "react-native-reanimated";
import { usePasswordRecoveryCooldown } from './(hooks)/usePasswordRecoveryCooldown';
import api from '~/lib/api';

const passwordRecoverySchema = z.object({
  email: z.string()
    .min(6, "Digite um e-mail válido.")
    .email("Digite um e-mail válido.")
    .refine((val) => val.includes("@") && val.includes("."), {
      message: "Digite um e-mail válido.",
    }),
});
type PasswordRecoveryForm = z.infer<typeof passwordRecoverySchema>;

export default function PasswordRecovery() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch } = useForm<PasswordRecoveryForm>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: { email: "" },
  });

  const { cooldown, startCooldown } = usePasswordRecoveryCooldown();

  const onSubmit = async (data: PasswordRecoveryForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/user/resetPassword/token', { email: data.email });
      if(!response.data) {
        alert('Erro ao enviar o e-mail de recuperação. Tente novamente mais tarde.');
        return;
      }
      setModalVisible(true);
      await startCooldown();

    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const emailValue = watch("email");
  const isDisabled = !emailValue || emailValue.length < 6 || cooldown > 0 || isLoading;

  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-4 items-start">
      <AppBackButton />

      <View className="w-full gap-2 mb-8" >

        <View className="mb-2">
         <Image source={lockImg} contentFit="contain" style={{ width: 40, height: 40 }} />

        </View>

        <Text className="font-bold text-primary text-2xl">Esqueceu sua senha?</Text>

        <Text className="font-regular text-base text-main-inputText">
          Digite o e-mail associado à sua conta.
        </Text>

      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <AppInput
              className="mb-2"
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && (
              <Animated.View
                entering={FadeInUp.duration(300).withInitialValues({ translateY: -12 })}
              >
                <Text className="text-red-500 text-sm pl-2">
                  {errors.email.message}
                </Text>
              </Animated.View>
            )}
          </>
        )}
      />

      <View className="flex-row items-center w-full">
        <Text className="font-regular text-sm text-primary"> 
          Lembrou sua senha?
        </Text>

        <AppTextButton onPress={() => router.replace('/(auth)/login')} className="pl-2" textClassName="text-sm">Entrar.</AppTextButton>
      </View>

      <View className="flex-1 w-full h-full justify-end" >
        <AppButton className="w-full mb-4" onPress={handleSubmit(onSubmit)} disabled={isDisabled}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Continuar'}
        </AppButton>
      </View>

      <AppModal
        visible={modalVisible}
        title="Verifique seu email"
        message={`Se o email "${emailValue}" estiver cadastrado, enviaremos um link para redefinir a senha ao email inserido.`}
        onClose={() => setModalVisible(false)}
        confirmText="OK"
      />
  
    </SafeAreaView>
  )
}
import { router, useLocalSearchParams } from 'expo-router';
import { Alarm, Brain, Warning } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import { AppAnswerCard } from '~/components/app/AppAnswerCard';
import { AppBackButton } from '~/components/app/AppBackButton';
import { AppButton } from '~/components/app/AppButton';
import { AppInput } from '~/components/app/AppInput';
import { AppModal } from '~/components/app/AppModal';
import { AppQuestionCard } from '~/components/app/AppQuestionCard';
import { useCountdown } from '~/hooks/useCountdown';
import { storageService } from '~/lib/services/storage';

type Question =
  | {
      id: string;
      type: 'alternatives';
      question: string;
      options: { id: string; text: string }[];
    }
  | { id: string; type: 'descriptive'; question: string };

type Answers = Record<string, string>;

export default function QuizExecuteScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const { endDate } = useLocalSearchParams();

  const timeRemaining = useCountdown(endDate as string);

  useEffect(() => {
    const setNextCurrentQuestion = () => {
      if (questions.length > 0) {
        setCurrentQuestion(questions[current]);
      } else {
        setCurrentQuestion(null);
      }
    };

    setNextCurrentQuestion();
  }, [current, questions]);

  // ISSO AQUI PEGA AS QUESTÕES DO STORAGE
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const questionsFromStorage = await storageService.getQuizQuestions();

        if (!questionsFromStorage) {
          throw new Error('Nenhuma questão encontrada no armazenamento.');
        }

        const formattedQuestions = questionsFromStorage.map(question => {
          return {
            type: 'alternatives',
            id: question.id,
            options: question.answers.map(alternative => ({
              id: alternative._id,
              text: alternative.text,
            })),
            question: question.title,
          } as Question;
        });

        setQuestions(formattedQuestions);
        setCurrentQuestion(formattedQuestions[0]);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar questões:', error);
        setError('Erro ao carregar as questões. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // ISSO AQUI ESCUTA O TECLADO PARA SABER SE ELE ESTÁ VISÍVEL OU NÃO
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setTimeout(() => setIsKeyboardVisible(false), 100),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [questions[current].id]: value }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert('Quiz finalizado!');
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleFinishingTest = () => {
    setShowFinishModal(true);
  };

  const confirmFinishingTest = () => {
    if (isSubmitting) return;
    try {
      setLoading(true);
      setIsSubmitting(true);
      console.log('Finalizando teste com as respostas:', answers);
      //////////////////////////////////////////////
      //CRIA A TEST-APPLICATION PRO BACK-END AQUI//
      ///////////////////////////////////////////
    } catch (error) {
      console.error('Erro ao finalizar o teste:', error);
      setError('Erro ao finalizar o teste. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
      alert('Teste finalizado com sucesso!');
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppBackButton
        onPress={() => setShowExitModal(true)}
        className="ml-4"
        disabled={isSubmitting}
      />

      {/* Exit confirmation modal */}
      <AppModal
        visible={showExitModal}
        title="Sair da atividade?"
        message="Tem certeza que deseja sair da atividade? Seu progresso não será perdido, porém o tempo continua."
        confirmText="Sim, sair"
        onPress={() => {
          setShowExitModal(false);
          router.back();
        }}
        onClose={() => setShowExitModal(false)}
        showCloseButton
      />

      {/* Finish confirmation modal */}
      <AppModal
        visible={showFinishModal}
        title="Finalizar teste?"
        message="Tem certeza que deseja finalizar o teste? Você não poderá alterar suas respostas depois disso."
        confirmText={isSubmitting ? 'Enviando...' : 'Sim, finalizar'}
        onPress={() => {
          setShowFinishModal(false);
          confirmFinishingTest();
        }}
        onClose={() => setShowFinishModal(false)}
        showCloseButton
      />

      {loading && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
          <View className="rounded-lg bg-white p-6 shadow-lg">
            <ActivityIndicator size="large" color="#4338CA" />
            <Text className="mt-4 text-center font-medium">
              Carregando questões...
            </Text>
          </View>
        </View>
      )}

      {isSubmitting && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
          <View className="rounded-lg bg-white p-6 shadow-lg">
            <ActivityIndicator size="large" color="#4338CA" />
            <Text className="mt-4 text-center font-medium">
              Enviando suas respostas...
            </Text>
          </View>
        </View>
      )}

      {error && (
        <View className="mx-6 mb-4 mt-2 rounded-md bg-red-100 p-4">
          <View className="flex-row items-center">
            <Warning size={24} color="#DC2626" />
            <Text className="ml-2 flex-1 text-red-800">{error}</Text>
          </View>
          <AppButton
            children="Tentar novamente"
            onPress={() => setError(null)}
            className="mt-2"
            variant="secondary"
          />
        </View>
      )}

      {!loading && (
        <>
          <View className="mb-12 w-full flex-row items-center justify-between px-6">
            <View className="flex-row items-center gap-3">
              <Brain size={26} color="#4338CA" />
              <Text className="text-lg font-bold text-primary">
                {`${current + 1} de ${questions.length}`}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-lg font-bold text-primary">
                {timeRemaining}
              </Text>
              <Alarm size={24} color="#4338CA" />
            </View>
          </View>

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={32}
          >
            <ScrollView
              className="flex-1 px-6"
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-start',
              }}
              keyboardShouldPersistTaps="handled"
            >
              <AppQuestionCard
                className="mb-12 w-full"
                title={`Questão: ${current + 1}`}
                questionText={currentQuestion?.question || ''}
              />

              {currentQuestion?.type === 'alternatives' ? (
                currentQuestion.options.map(item => (
                  <AppAnswerCard
                    key={item.id}
                    selected={answers[currentQuestion.id] === item.id}
                    onPress={() => handleAnswer(item.id)}
                    className="mb-6"
                  >
                    {item.text}
                  </AppAnswerCard>
                ))
              ) : (
                <AppInput
                  placeholder="Digite sua resposta..."
                  value={
                    currentQuestion ? answers[currentQuestion.id] || '' : ''
                  }
                  onChangeText={handleAnswer}
                  multiline
                  className="mb-6 min-h-40 py-6"
                  textAlignVertical="top"
                  numberOfLines={12}
                  editable={!isSubmitting}
                />
              )}
            </ScrollView>
          </KeyboardAvoidingView>

          {!isKeyboardVisible && (
            <View className="flex-row gap-8 px-6 pb-6">
              {current > 0 && (
                <AppButton
                  children="Anterior"
                  onPress={handlePrev}
                  className="flex-1"
                  variant="secondary"
                  disabled={isSubmitting}
                />
              )}

              {current < questions.length - 1 ? (
                <AppButton
                  children="Próxima"
                  onPress={handleNext}
                  disabled={
                    !currentQuestion?.id ||
                    !answers[currentQuestion.id] ||
                    isSubmitting
                  }
                  className={current > 0 ? 'flex-1' : 'flex-[2]'}
                />
              ) : (
                <AppButton
                  children={isSubmitting ? 'Enviando...' : 'Finalizar'}
                  onPress={handleFinishingTest}
                  disabled={
                    !currentQuestion ||
                    !answers[currentQuestion.id] ||
                    isSubmitting
                  }
                  className={current > 0 ? 'flex-1' : 'flex-[2]'}
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

import { router } from 'expo-router';
import { Alarm, Brain } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  ScrollView,
  Keyboard,
} from 'react-native';

import { AppAnswerCard } from '~/components/app/AppAnswerCard';
import { AppBackButton } from '~/components/app/AppBackButton';
import { AppButton } from '~/components/app/AppButton';
import { AppInput } from '~/components/app/AppInput';
import { AppModal } from '~/components/app/AppModal';
import { AppQuestionCard } from '~/components/app/AppQuestionCard';

// Mock de questões - depois trocar por fetch do backend
type Question =
  | { id: string; type: 'alternatives'; question: string; options: string[] }
  | { id: string; type: 'descriptive'; question: string };

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'alternatives',
    question: 'Qual a capital da França?',
    options: ['Paris', 'Londres', 'Berlim', 'Roma'],
  },
  {
    id: '2',
    type: 'descriptive',
    question: 'Explique o conceito de fotossíntese.',
  },
  {
    id: '3',
    type: 'alternatives',
    question: 'Qual o resultado de 2 + 2?',
    options: ['3', '4', '5', '6'],
  },
];

type Answers = Record<string, string>;

export default function QuizExecuteScreen() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const question = mockQuestions[current];

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
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (current < mockQuestions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Aqui pode enviar as respostas para o backend
      alert('Quiz finalizado!');
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <AppBackButton onPress={() => setShowExitModal(true)} className="ml-4" />
      <AppModal
        visible={showExitModal}
        title="Sair da atividade?"
        message="Tem certeza que deseja sair da atividade? Seu progresso será perdido."
        confirmText="Sim, sair"
        onPress={() => {
          setShowExitModal(false);
          router.back();
        }}
        onClose={() => setShowExitModal(false)}
        showCloseButton
      />
      <View className="mb-12 w-full flex-row items-center justify-between px-6">
        <View className="flex-row items-center gap-3">
          <Brain size={26} color="#4338CA" />
          <Text className=" text-lg font-bold">
            {`${current + 1} de ${mockQuestions.length}`}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Text className=" text-lg font-bold">{`Tempo restante`}</Text>
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          keyboardShouldPersistTaps="handled"
        >
          <AppQuestionCard
            className="mb-12 w-full"
            title={`Questão: ${current + 1}`}
            questionText={question.question}
          />
          {question.type === 'alternatives' ? (
            question.options.map(item => (
              <AppAnswerCard
                key={item}
                selected={answers[question.id] === item}
                onPress={() => handleAnswer(item)}
                className="mb-2"
              >
                {item}
              </AppAnswerCard>
            ))
          ) : (
            <AppInput
              placeholder="Digite sua resposta..."
              value={answers[question.id] || ''}
              onChangeText={handleAnswer}
              multiline
              className="mb-6 min-h-40 py-6"
              textAlignVertical="top"
              numberOfLines={12}
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
            />
          )}
          <AppButton
            children={
              current < mockQuestions.length - 1 ? 'Próxima' : 'Finalizar'
            }
            onPress={handleNext}
            disabled={!answers[question.id]}
            className={current > 0 ? 'flex-1' : 'flex-[2]'}
          />
        </View>
      )}
    </View>
  );
}

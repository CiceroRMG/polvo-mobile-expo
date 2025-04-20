import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { cn } from '~/lib/utils';

interface AppModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  className?: string;
}

export function AppModal({
  visible,
  title,
  message,
  onClose,
  confirmText = 'OK',
  className = '',
  ...props
}: AppModalProps) {
  return (
    <Modal 
        isVisible={visible} 
        onBackdropPress={onClose} 
        hideModalContentWhileAnimating
        backdropOpacity={0.5}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        
        {...props}
        
    >
      <View className={cn(
        'bg-background rounded-3xl p-8 items-start',
        className
      )}>
        {title && (
          <Text className="text-2xl font-medium mb-4 text-primary text-center">
            {title}
          </Text>
        )}
        <Text className="text-base text-main-inputText mb-8 text-start">
          {message}
        </Text>
        <TouchableOpacity
          className="bg-transparent py-2 px-8 self-end"
          onPress={onClose}
        >
          <Text className="text-main-purple font-medium text-base">{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
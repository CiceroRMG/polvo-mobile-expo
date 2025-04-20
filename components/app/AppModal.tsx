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
      <View
        className={cn('bg-background rounded-3xl p-8 items-start', className)}
      >
        {title && (
          <Text className="mb-4 text-center text-2xl font-medium text-primary">
            {title}
          </Text>
        )}
        <Text className="mb-8 text-start text-base text-main-inputText">
          {message}
        </Text>
        <TouchableOpacity
          className="self-end bg-transparent px-8 py-2"
          onPress={onClose}
        >
          <Text className="text-base font-medium text-main-purple">
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

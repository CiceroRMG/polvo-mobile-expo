import { X } from 'phosphor-react-native';
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import { cn } from '~/lib/utils';

interface AppModalProps {
  visible: boolean;
  hasBackdrop?: boolean;
  title?: string;
  message: string;
  onClose?: () => void;
  onPress?: () => void;
  confirmText?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function AppModal({
  visible,
  hasBackdrop = true,
  title,
  message,
  onClose,
  onPress,
  confirmText = 'OK',
  className = '',
  showCloseButton = false,
  ...props
}: AppModalProps) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      hideModalContentWhileAnimating
      backdropOpacity={0.4}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      animationInTiming={200}
      animationOutTiming={400}
      useNativeDriverForBackdrop={false}
      coverScreen={true}
      hasBackdrop={hasBackdrop}
      {...props}
    >
      <View
        className={cn('bg-background rounded-3xl p-8 items-start', className)}
      >
        {showCloseButton && (
          <TouchableOpacity
            className="absolute right-4 top-4 z-10 p-2"
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Fechar"
          >
            <X size={22} color="#797979" weight="bold" />
          </TouchableOpacity>
        )}
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
          onPress={onPress ?? onClose}
        >
          <Text className="text-base font-medium text-main-purple">
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

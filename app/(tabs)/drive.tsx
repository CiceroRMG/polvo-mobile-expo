import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as React from 'react';
import { Text } from 'react-native';

import loadJohnGIf from '~/assets/images/john.gif';

export default function Drive() {
  return (
    <>
      <BlurView
        intensity={20}
        tint="systemUltraThinMaterial"
        className="flex-1 items-center justify-center bg-main-card"
      >
        <Image source={loadJohnGIf} style={{ width: 150, height: 150 }} />

        <Text className="mt-4 text-center text-lg font-bold text-primary">
          Funcionalidade disponível em breve...
        </Text>
      </BlurView>
    </>
  );
}

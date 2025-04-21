import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';

interface UsePasswordRecoveryCooldownOptions {
  cooldownSeconds?: number;
  storageKey?: string;
}

export default function usePasswordRecoveryCooldown({
  cooldownSeconds = 60,
  storageKey = 'passwordRecoveryCooldown',
}: UsePasswordRecoveryCooldownOptions = {}) {
  const [cooldown, setCooldown] = useState(0);
  // eslint-disable-next-line no-undef
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const lastSent = await AsyncStorage.getItem(storageKey);
      if (lastSent) {
        const lastSentDate = new Date(parseInt(lastSent, 10));
        const now = new Date();
        const diff = Math.floor(
          (now.getTime() - lastSentDate.getTime()) / 1000,
        );
        if (diff < cooldownSeconds) setCooldown(cooldownSeconds - diff);
      }
    })();
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [cooldownSeconds, storageKey]);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown(c => c - 1), 1000);
    } else if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
      cooldownRef.current = null;
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [cooldown]);

  const startCooldown = async () => {
    setCooldown(cooldownSeconds);
    await AsyncStorage.setItem(storageKey, Date.now().toString());
  };

  return { cooldown, startCooldown };
}

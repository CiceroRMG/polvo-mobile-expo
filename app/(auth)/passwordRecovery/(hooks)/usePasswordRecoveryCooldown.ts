import { useState, useEffect, useRef } from 'react';

import { storageService } from '~/lib/services/storage';

interface UsePasswordRecoveryCooldownOptions {
  cooldownSeconds?: number;
  storageKey?: string;
}

export default function usePasswordRecoveryCooldown({
  cooldownSeconds = 60,
  storageKey = 'passwordRecoveryCooldown',
}: UsePasswordRecoveryCooldownOptions = {}) {
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load any existing cooldown from storage when component mounts
  useEffect(() => {
    const loadExistingCooldown = async () => {
      try {
        const lastSentTimestamp = await storageService.getItem(storageKey);
        if (!lastSentTimestamp) return;

        const elapsedSeconds = getElapsedSeconds(
          parseInt(lastSentTimestamp, 10),
        );
        const remainingCooldown = Math.max(0, cooldownSeconds - elapsedSeconds);

        if (remainingCooldown > 0) {
          setCooldown(remainingCooldown);
        }
      } catch (error) {
        console.error('Failed to load cooldown state:', error);
      }
    };

    loadExistingCooldown();

    // Cleanup timer on unmount
    return () => clearTimerIfExists();
  }, [cooldownSeconds, storageKey]);

  // Handle the countdown timer
  useEffect(() => {
    if (cooldown <= 0) {
      clearTimerIfExists();
      return;
    }

    // Set up a 1-second interval timer
    timerRef.current = setTimeout(() => {
      setCooldown(current => current - 1);
    }, 1000);

    // Cleanup timer if component unmounts during countdown
    return () => clearTimerIfExists();
  }, [cooldown]);

  // Helper function to calculate elapsed seconds
  const getElapsedSeconds = (timestamp: number): number => {
    const now = Date.now();
    return Math.floor((now - timestamp) / 1000);
  };

  // Helper to safely clear the timer
  const clearTimerIfExists = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start a new cooldown period
  const startCooldown = async () => {
    const now = Date.now();
    setCooldown(cooldownSeconds);
    await storageService.setItem(storageKey, now.toString());
  };

  return { cooldown, startCooldown };
}

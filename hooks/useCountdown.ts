import { useState, useEffect, useCallback } from 'react';

export function useCountdown(endDateStr?: string) {
  const calculateTimeRemaining = useCallback(() => {
    if (!endDateStr) return 'Não disponível';

    try {
      const endDate = new Date(endDateStr);
      const now = new Date();

      if (now >= endDate) {
        return 'Prazo encerrado';
      }

      const diffMs = endDate.getTime() - now.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const days = Math.floor(diffSec / (3600 * 24));

      if (days > 0) {
        return days === 1 ? '1 dia restante' : `${days} dias restantes`;
      }

      const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } catch {
      return 'Erro no cálculo';
    }
  }, [endDateStr]);

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining());
    if (!endDateStr) return;

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endDateStr, calculateTimeRemaining]);

  return timeRemaining;
}

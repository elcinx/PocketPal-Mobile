import { useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

export const useGamification = () => {
  const { game, setGame } = useAppContext();

  const addXP = useCallback((amount: number) => {
    setGame(prev => {
      const newXP = prev.xp + amount;
      const xpToNextLevel = prev.level * 100;
      
      if (newXP >= xpToNextLevel) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return {
          ...prev,
          xp: newXP - xpToNextLevel,
          level: prev.level + 1,
          coins: prev.coins + (prev.level * 50),
        };
      }
      
      return { ...prev, xp: newXP };
    });
  }, [setGame]);

  const addCoins = useCallback((amount: number) => {
    setGame(prev => ({ ...prev, coins: prev.coins + amount }));
  }, [setGame]);

  const spendCoins = useCallback((amount: number) => {
    if (game.coins >= amount) {
      setGame(prev => ({ ...prev, coins: prev.coins - amount }));
      return true;
    }
    return false;
  }, [game.coins, setGame]);

  return { game, addXP, addCoins, spendCoins };
};

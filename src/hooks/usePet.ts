import { useEffect, useCallback, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

export const usePet = () => {
  const { stats, setStats, setGame } = useAppContext();
  const [petState, setInternalState] = useState<'idle' | 'happy' | 'hungry' | 'sleeping' | 'cleaning' | 'dirty'>('idle');

  // Track global state for 'hungry' or 'dirty'
  useEffect(() => {
    if (petState !== 'cleaning' && petState !== 'happy') {
      if (stats.hunger < 20) setInternalState('hungry');
      else if (stats.hygiene < 30) setInternalState('dirty');
      else setInternalState('idle');
    }
  }, [stats.hunger, stats.hygiene, petState]);

  const feed = useCallback((hungerAmount = 15, xpAmount = 10, coinsAmount = 5) => {
    setStats(prev => ({
      ...prev,
      hunger: Math.min(prev.hunger + hungerAmount, 100),
    }));
    setGame(prev => ({
      ...prev,
      xp: prev.xp + xpAmount,
      coins: prev.coins + coinsAmount,
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setInternalState('happy');
    setTimeout(() => setInternalState('idle'), 2000);
  }, [setStats, setGame]);

  const play = useCallback(() => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(prev.happiness + 20, 100),
    }));
    setGame(prev => ({
      ...prev,
      xp: prev.xp + 15,
      coins: prev.coins + 8,
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setInternalState('happy');
    setTimeout(() => setInternalState('idle'), 2000);
  }, [setStats, setGame]);

  const clean = useCallback(() => {
    setInternalState('cleaning');
    setStats(prev => ({
      ...prev,
      hygiene: 100, // Now fills completely to 100%
    }));
    setGame(prev => ({
      ...prev,
      xp: prev.xp + 15,
      coins: prev.coins + 5,
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setTimeout(() => setInternalState('idle'), 3000);
  }, [setStats, setGame]);

  const playGame = useCallback((xpAmount = 420, coinsAmount = 420) => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(prev.happiness + 50, 100),
    }));
    setGame(prev => ({
      ...prev,
      xp: prev.xp + xpAmount,
      coins: prev.coins + coinsAmount,
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    setInternalState('happy');
    setTimeout(() => setInternalState('idle'), 3000);
  }, [setStats, setGame]);

  // Stat Decay (Faster Tuning)
  useEffect(() => {
    const hungerTimer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hunger: Math.max(prev.hunger - 1, 0),
      }));
    }, 10000); // 10s

    const happinessTimer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        happiness: Math.max(prev.happiness - 1, 0),
      }));
    }, 7000); // 7s

    const hygieneTimer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hygiene: Math.max(prev.hygiene - 1, 0),
      }));
    }, 8000); // 8s - More noticeable

    return () => {
      clearInterval(hungerTimer);
      clearInterval(happinessTimer);
      clearInterval(hygieneTimer);
    };
  }, [setStats]);

  return { stats, feed, play, clean, playGame, petState };
};

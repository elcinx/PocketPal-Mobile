import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PetType = 'rabbit' | 'cat' | 'dog';

export interface PetStats {
  hunger: number;
  happiness: number;
  hygiene: number;
}

export interface GamificationState {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastLogin: string | null;
}


interface AppContextType {
  petName: string;
  setPetName: (name: string) => void;
  petType: PetType;
  setPetType: (type: PetType) => void;
  stats: PetStats;
  setStats: React.Dispatch<React.SetStateAction<PetStats>>;
  game: GamificationState;
  setGame: React.Dispatch<React.SetStateAction<GamificationState>>;
  unlockedAccessories: string[];
  setUnlockedAccessories: (ids: string[]) => void;
  selectedAccessory: string | null;
  setSelectedAccessory: (id: string | null) => void;
  wallpaper: string;
  setWallpaper: (id: string) => void;
  foodInventory: Record<string, number>;
  setFoodInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  resetApp: () => Promise<void>;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<PetType>('rabbit');
  const [stats, setStats] = useState<PetStats>({ hunger: 80, happiness: 80, hygiene: 100 });
  const [game, setGame] = useState<GamificationState>({
    xp: 0,
    level: 1,
    coins: 100,
    streak: 1,
    lastLogin: new Date().toISOString(),
  });
  const [unlockedAccessories, setUnlockedAccessories] = useState<string[]>([]);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [wallpaper, setWallpaper] = useState<string>('default');
  const [foodInventory, setFoodInventory] = useState<Record<string, number>>({
    'item_carrot': 0,
    'item_apple': 0,
    'item_pizza': 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence logic
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedName = await AsyncStorage.getItem('petName');
        const savedType = await AsyncStorage.getItem('petType');
        const savedStats = await AsyncStorage.getItem('petStats');
        const savedGame = await AsyncStorage.getItem('petGame');
        const savedAccessories = await AsyncStorage.getItem('accessories');
        const savedSelectedAcc = await AsyncStorage.getItem('selectedAccessory');
        const savedWallpaper = await AsyncStorage.getItem('wallpaper');
        const savedInventory = await AsyncStorage.getItem('foodInventory');

        if (savedName) setPetName(savedName);
        if (savedType) setPetType(savedType as PetType);
        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedGame) setGame(JSON.parse(savedGame));
        if (savedAccessories) setUnlockedAccessories(JSON.parse(savedAccessories));
        if (savedSelectedAcc) setSelectedAccessory(savedSelectedAcc);
        if (savedWallpaper) setWallpaper(savedWallpaper);
        if (savedInventory) setFoodInventory(JSON.parse(savedInventory));
      } catch (e) {
        console.error('Failed to load state', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('petName', petName);
      AsyncStorage.setItem('petType', petType);
      AsyncStorage.setItem('petStats', JSON.stringify(stats));
      AsyncStorage.setItem('petGame', JSON.stringify(game));
      AsyncStorage.setItem('accessories', JSON.stringify(unlockedAccessories));
      if (selectedAccessory) AsyncStorage.setItem('selectedAccessory', selectedAccessory);
      else AsyncStorage.removeItem('selectedAccessory');
      AsyncStorage.setItem('wallpaper', wallpaper);
      AsyncStorage.setItem('foodInventory', JSON.stringify(foodInventory));
    }
  }, [petName, petType, stats, game, unlockedAccessories, selectedAccessory, wallpaper, foodInventory, isLoaded]);

  const resetApp = async () => {
    await AsyncStorage.clear();
    setPetName('');
    setPetType('rabbit');
    setStats({ hunger: 80, happiness: 80, hygiene: 100 });
    setGame({ xp: 0, level: 1, coins: 100, streak: 1, lastLogin: new Date().toISOString() });
    setUnlockedAccessories([]);
    setSelectedAccessory(null);
    setWallpaper('default');
    setFoodInventory({
      'item_carrot': 0,
      'item_apple': 0,
      'item_pizza': 0,
    });
  };

  return (
    <AppContext.Provider value={{
      petName, setPetName,
      petType, setPetType,
      stats, setStats,
      game, setGame,
      unlockedAccessories, setUnlockedAccessories,
      selectedAccessory, setSelectedAccessory,
      wallpaper, setWallpaper,
      foodInventory, setFoodInventory,
      resetApp,
      isLoaded
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

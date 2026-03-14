import React from 'react';
import * as Haptics from 'expo-haptics';
import { View, Text, StyleSheet, SafeAreaView, Platform, Pressable, Modal, TouchableOpacity, Alert } from 'react-native';
import { Pet } from '../components/Pet';
import { ProgressBar } from '../components/ProgressBar';
import { ActionButton } from '../components/ActionButton';
import { useAppContext } from '../context/AppContext';
import { usePet } from '../hooks/usePet';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';
import { Pizza, Gamepad2, Coins, Trophy, Settings, Heart, Droplets, Star, Carrot, Apple, Zap, Brain } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { FOOD_ITEMS } from './ShopScreen';

export const HomeScreen: React.FC = () => {
  const { 
    petName, 
    game, 
    setGame,
    unlockedAccessories, 
    setUnlockedAccessories,
    selectedAccessory,
    setSelectedAccessory,
    wallpaper,
    setWallpaper,
    foodInventory,
    setFoodInventory
  } = useAppContext();
  const { stats, feed, play, clean, playGame, petState } = usePet();
  const [showGame, setShowGame] = React.useState(false);
  const [showFoodMenu, setShowFoodMenu] = React.useState(false);

  const navigation = useNavigation<any>();

  const handleMiniGame = () => {
    setShowGame(true);
  };

  const handleFoodSelect = (foodId: string) => {
    const food = FOOD_ITEMS.find(i => i.id === foodId);
    if (!food || (foodInventory[foodId] || 0) <= 0) return;

    feed(food.hunger || 0, food.xp || 0, 0); // xp and coins reward are handled in feed
    setFoodInventory(prev => ({
      ...prev,
      [foodId]: prev[foodId] - 1
    }));
    setShowFoodMenu(false);
  };

  const renderBackground = () => {
    switch (wallpaper) {
      case 'pink': return { backgroundColor: '#FCE4EC' };
      case 'blue': return { backgroundColor: '#E3F2FD' };
      case 'green': return { backgroundColor: '#E8F5E9' };
      case 'stars': return { backgroundColor: '#F3E5F5' };
      default: return { backgroundColor: COLORS.background };
    }
  };

  return (
    <SafeAreaView style={[styles.container, renderBackground()]}>
      <View style={styles.header}>
        <View style={styles.currencyWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('Shop')} style={styles.currencyContainer}>
            <Coins size={22} color={COLORS.warning} />
            <Text style={styles.currencyText}>{game.coins}</Text>
          </TouchableOpacity>
          <View style={[styles.currencyContainer, { backgroundColor: COLORS.accent, marginLeft: SPACING.sm }]}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.primary }}>v2.0 YENİ!</Text>
          </View>
          <View style={[styles.currencyContainer, { backgroundColor: COLORS.accent, marginLeft: SPACING.sm }]}>
            <Trophy size={18} color={COLORS.secondary} />
            <Text style={styles.currencyText}>Seviye {game.level}</Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row' }}>
          <Pressable 
            onPress={() => navigation.navigate('Shop')}
            style={[styles.settingsButton, { marginRight: SPACING.sm, borderColor: COLORS.primary }]}
          >
            <Star size={24} color={COLORS.primary} fill={COLORS.primary} />
          </Pressable>
          <Pressable 
            onPress={() => navigation.navigate('Profile')}
            style={styles.settingsButton}
          >
            <Settings size={24} color={COLORS.textLight} />
          </Pressable>
        </View>
      </View>

      <View style={styles.petSection}>
        <View style={[styles.nameTag, { backgroundColor: COLORS.secondary }]}>
           <Text style={styles.petName}>{petName || 'Pamuk'}</Text>
        </View>
        <Pet type={useAppContext().petType} state={petState as any} accessory={selectedAccessory} />
      </View>

      <View style={styles.statsSection}>
        <ProgressBar label="Tokluk" value={stats.hunger} color={COLORS.primary} />
        <ProgressBar label="Neşe" value={stats.happiness} color={COLORS.secondary} />
        <ProgressBar label="Temizlik" value={stats.hygiene} color="#00BCD4" />
        
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
             <View style={[styles.xpBarFill, { width: `${Math.min((game.xp / (game.level * 100)) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.xpText}>XP: {game.xp} / {game.level * 100}</Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        {showFoodMenu ? (
          <View style={styles.foodMenu}>
            {FOOD_ITEMS.map(item => {
              const count = foodInventory[item.id] || 0;
              if (count <= 0) return null;
              
              return (
                <TouchableOpacity 
                  key={item.id} 
                  onPress={() => handleFoodSelect(item.id)} 
                  style={styles.foodItem}
                >
                  <View style={styles.foodIconContainer}>
                    {item.icon}
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{count}</Text>
                    </View>
                  </View>
                  <Text style={styles.foodLabel}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
            
            {Object.values(foodInventory).every(v => v === 0) && (
              <Text style={{ color: COLORS.textLight, fontSize: 12, fontStyle: 'italic' }}>
                Envanter boş! Mağazadan yemek alabilirsin.
              </Text>
            )}

            <TouchableOpacity onPress={() => setShowFoodMenu(false)} style={styles.closeMenu}>
              <Text style={styles.closeMenuText}>X</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.actionsRow}>
              <ActionButton 
                title="Yemek" 
                onPress={() => setShowFoodMenu(true)} 
                color={COLORS.primary}
                icon={<Pizza color="white" size={20} />}
                style={styles.actionButtonSmall}
              />
              <ActionButton 
                title="Sev" 
                onPress={play} 
                color={COLORS.secondary}
                icon={<Heart color="white" size={20} fill="white" />}
                style={styles.actionButtonSmall}
              />
            </View>
            <View style={[styles.actionsRow, { marginTop: SPACING.sm }]}>
              <ActionButton 
                title="Oyna" 
                onPress={handleMiniGame} 
                color="#FF9800"
                icon={<Gamepad2 color="white" size={20} />}
                style={styles.actionButtonSmall}
              />
              <ActionButton 
                title="Temizle" 
                onPress={clean} 
                color="#00BCD4"
                icon={<Droplets color="white" size={20} />}
                style={styles.actionButtonSmall}
              />
            </View>
          </>
        )}
      </View>

      {showGame && (
        <MiniGameModal 
          onClose={() => setShowGame(false)} 
          onWin={() => {
            playGame();
            Alert.alert(
              'Oyun Tamamlandı! 🎉', 
              'Harika iş! Görev tamamlandı. +420 Coin kazandın!',
              [{ text: 'Ana Sayfaya Dön', onPress: () => setShowGame(false) }]
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  currencyWrapper: {
    flexDirection: 'row',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  settingsButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyText: {
    marginLeft: SPACING.xs,
    fontWeight: '900',
    color: COLORS.text,
    fontSize: 16,
  },
  petSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameTag: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  petName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.white,
  },
  statsSection: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  xpContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  xpBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6', // Vibrant Purple for XP
  },
  xpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  actionsSection: {
    padding: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 0 : SPACING.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  actionButtonSmall: {
    flex: 0.48,
  },
  foodMenu: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...SHADOWS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  foodItem: {
    alignItems: 'center',
  },
  foodLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  foodIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  closeMenu: {
    padding: 8,
    backgroundColor: COLORS.border,
    borderRadius: 15,
  },
  closeMenuText: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

// Enhanced Multi-Game Hub Component
const MiniGameModal: React.FC<{ onClose: () => void; onWin: () => void }> = ({ onClose, onWin }) => {
  const [gameMode, setGameMode] = React.useState<'hub' | 'tapping' | 'catching' | 'memory' | 'balloons' | 'foodCatch'>('hub');
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [gameEnded, setGameEnded] = React.useState(false);

  // --- Tapping Game State ---
  const [taps, setTaps] = React.useState(0);
  const targetTaps = 15;

  // --- Star Catching State ---
  const [starPos, setStarPos] = React.useState({ x: 50, y: 50 });

  // --- Memory Game State ---
  const [cards, setCards] = React.useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = React.useState<number[]>([]);

  const startGame = (mode: 'tapping' | 'catching' | 'memory' | 'balloons' | 'foodCatch') => {
    setGameMode(mode);
    setScore(0);
    setGameEnded(false);
    
    if (mode === 'tapping') {
      setTimeLeft(7);
      setTaps(0);
    } else if (mode === 'catching') {
      setTimeLeft(12);
      setScore(0);
      spawnStar();
    } else if (mode === 'memory') {
      setTimeLeft(15);
      const symbols = ['🐱', '🐶', '🐰', '🐹'];
      const deck = [...symbols, ...symbols]
        .map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }))
        .sort(() => Math.random() - 0.5);
      setCards(deck);
      setSelectedCards([]);
    } else if (mode === 'balloons') {
      setTimeLeft(10);
      setScore(0);
    } else if (mode === 'foodCatch') {
      setTimeLeft(15);
      setScore(0);
    }
  };

  const spawnStar = () => {
    setStarPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    });
  };

  const handleStarClick = () => {
    setScore(s => s + 1);
    spawnStar();
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 2 || cards[id].flipped || cards[id].matched || timeLeft === 0) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          if (matchedCards.every(c => c.matched)) endGame(true);
        }, 500);
      } else {
        setTimeout(() => {
          const flippedBack = [...cards];
          flippedBack[first].flipped = false;
          flippedBack[second].flipped = false;
          setCards(flippedBack);
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  const endGame = (win: boolean) => {
    setGameEnded(true);
    if (win) {
      onWin();
    } else {
      Alert.alert('Süre Doldu! ⏰', 'Üzgünüm, süre doldu. Tekrar dene!');
      onClose();
    }
  };

  React.useEffect(() => {
    if (gameMode !== 'hub' && timeLeft > 0 && !gameEnded) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      
      // Auto-win triggers
      if (gameMode === 'tapping' && taps >= targetTaps) endGame(true);
      if (gameMode === 'catching' && score >= 5) endGame(true);
      if (gameMode === 'balloons' && score >= 8) endGame(true);
      if (gameMode === 'foodCatch' && score >= 6) endGame(true);
      
      return () => clearInterval(timer);
    } else if (gameMode !== 'hub' && timeLeft === 0 && !gameEnded) {
      // Last second check
      if (gameMode === 'tapping' && taps >= targetTaps) endGame(true);
      else if (gameMode === 'catching' && score >= 5) endGame(true);
      else if (gameMode === 'balloons' && score >= 8) endGame(true);
      else if (gameMode === 'foodCatch' && score >= 6) endGame(true);
      else endGame(false);
    }
  }, [timeLeft, gameMode, taps, score, gameEnded]);

  const renderHub = () => (
    <View style={modalStyles.hubContent}>
      <Text style={modalStyles.title}>Oyun Merkezi 🎮</Text>
      <Text style={modalStyles.subtitle}>Bir oyun seç ve ödülleri topla!</Text>
      
      <TouchableOpacity style={modalStyles.gameOption} onPress={() => startGame('tapping')}>
        <Zap size={32} color={COLORS.warning} />
        <View style={modalStyles.gameDetail}>
          <Text style={modalStyles.gameTitle}>Hızlı Dokun!</Text>
          <Text style={modalStyles.gameDesc}>7 saniyede {targetTaps} tıklama yap!</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={modalStyles.gameOption} onPress={() => startGame('catching')}>
        <Star size={32} color={COLORS.secondary} />
        <View style={modalStyles.gameDetail}>
          <Text style={modalStyles.gameTitle}>Yıldız Yakala!</Text>
          <Text style={modalStyles.gameDesc}>12 saniyede 5 yıldız yakala!</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={modalStyles.gameOption} onPress={() => startGame('memory')}>
        <Brain size={32} color={COLORS.primary} />
        <View style={modalStyles.gameDetail}>
          <Text style={modalStyles.gameTitle}>Hafıza Kartları</Text>
          <Text style={modalStyles.gameDesc}>Tüm eşleri bul!</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={modalStyles.gameOption} onPress={() => startGame('balloons')}>
        <Droplets size={32} color={COLORS.success} />
        <View style={modalStyles.gameDetail}>
          <Text style={modalStyles.gameTitle}>Balon Patlat! 🎈</Text>
          <Text style={modalStyles.gameDesc}>10 saniyede 8 balon patlat!</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={modalStyles.gameOption} onPress={() => startGame('foodCatch')}>
        <Pizza size={32} color={COLORS.primary} />
        <View style={modalStyles.gameDetail}>
          <Text style={modalStyles.gameTitle}>Yemek Topla! 🍕</Text>
          <Text style={modalStyles.gameDesc}>15 saniyede 6 yemek yakala!</Text>
        </View>
      </TouchableOpacity>

      <ActionButton title="Kapat" onPress={onClose} color={COLORS.textLight} style={{ marginTop: SPACING.lg }} />
    </View>
  );

  const renderTapping = () => {
    const progress = taps / targetTaps;
    return (
      <>
        <View style={modalStyles.timerContainer}>
          <Text style={[modalStyles.timerText, timeLeft < 3 && { color: COLORS.danger }]}>{timeLeft}s</Text>
        </View>
        <Text style={modalStyles.title}>Hızlı Dokun! ⚡</Text>
        <Text style={modalStyles.subtitle}>Tüm gücünle tıkla!</Text>
        <View style={modalStyles.energyContainer}>
          <View style={[modalStyles.energyFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: progress > 0.7 ? COLORS.success : COLORS.warning }]} />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setTaps(t => t + 1)} style={modalStyles.gameTarget}>
          <Star size={60} color={progress > 0.8 ? COLORS.primary : COLORS.warning} fill={progress > 0.8 ? COLORS.primary : COLORS.warning} />
          <Text style={modalStyles.tapCount}>{taps}</Text>
        </TouchableOpacity>
        {taps > 5 && <Text style={modalStyles.comboText}>{progress >= 1 ? 'TAMAM! 🔥' : 'HADI! 🚀'}</Text>}
      </>
    );
  };

  const renderCatching = () => (
    <>
      <View style={modalStyles.timerContainer}>
        <Text style={[modalStyles.timerText, timeLeft < 3 && { color: COLORS.danger }]}>{timeLeft}s</Text>
      </View>
      <Text style={modalStyles.title}>Yıldız Yakala! ⭐</Text>
      <Text style={modalStyles.subtitle}>Skor: {score} / 5</Text>
      <View style={modalStyles.catchingArea}>
        <TouchableOpacity 
          onPress={handleStarClick}
          style={[modalStyles.starTarget, { left: `${starPos.x}%`, top: `${starPos.y}%` }]}
        >
          <Star size={40} color={COLORS.warning} fill={COLORS.warning} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderMemory = () => (
    <>
      <View style={modalStyles.timerContainer}>
        <Text style={[modalStyles.timerText, timeLeft < 5 && { color: COLORS.danger }]}>{timeLeft}s</Text>
      </View>
      <Text style={modalStyles.title}>Hafıza 🧠</Text>
      <Text style={modalStyles.subtitle}>Tüm eşleri bul!</Text>
      <View style={modalStyles.memoryGrid}>
        {cards.map((card, idx) => (
          <TouchableOpacity 
            key={card.id} 
            onPress={() => handleCardClick(idx)}
            style={[modalStyles.card, (card.flipped || card.matched) && modalStyles.cardFlipped]}
          >
            <Text style={modalStyles.cardText}>{(card.flipped || card.matched) ? card.symbol : '?'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderBalloons = () => (
    <>
      <View style={modalStyles.timerContainer}>
        <Text style={[modalStyles.timerText, timeLeft < 3 && { color: COLORS.danger }]}>{timeLeft}s</Text>
      </View>
      <Text style={modalStyles.title}>Balon Patlat! 🎈</Text>
      <Text style={modalStyles.subtitle}>Puan: {score} / 8</Text>
      <View style={modalStyles.catchingArea}>
        {[...Array(3)].map((_, i) => (
          <TouchableOpacity 
            key={i}
            onPress={() => setScore(s => s + 1)}
            style={[modalStyles.starTarget, { 
              left: `${(i * 30 + 10 + Math.sin(timeLeft + i) * 10)}%`, 
              top: `${(50 + Math.cos(timeLeft * 2 + i) * 30)}%`,
              backgroundColor: i === 0 ? COLORS.primary : i === 1 ? COLORS.secondary : COLORS.warning,
              width: 50, height: 60, borderRadius: 25
            }]}
          />
        ))}
      </View>
    </>
  );

  const renderFoodCatch = () => (
    <>
      <View style={modalStyles.timerContainer}>
        <Text style={[modalStyles.timerText, timeLeft < 3 && { color: COLORS.danger }]}>{timeLeft}s</Text>
      </View>
      <Text style={modalStyles.title}>Yemek Topla! 🍕</Text>
      <Text style={modalStyles.subtitle}>Puan: {score} / 6</Text>
      <View style={modalStyles.catchingArea}>
        <TouchableOpacity 
          onPress={() => setScore(s => s + 1)}
          style={[modalStyles.starTarget, { 
            left: `${(40 + Math.sin(timeLeft * 1.5) * 40)}%`, 
            top: `${(timeLeft * 10) % 80}%` 
          }]}
        >
          <Pizza size={50} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.content}>
          {gameMode === 'hub' && renderHub()}
          {gameMode === 'tapping' && renderTapping()}
          {gameMode === 'catching' && renderCatching()}
          {gameMode === 'memory' && renderMemory()}
          {gameMode === 'balloons' && renderBalloons()}
          {gameMode === 'foodCatch' && renderFoodCatch()}
          
          {gameMode !== 'hub' && !gameEnded && (
             <ActionButton title="Vazgeç" onPress={() => setGameMode('hub')} color={COLORS.textLight} style={{ marginTop: SPACING.lg }} />
          )}
        </View>
      </View>
    </Modal>
  );
};

// Custom Styles for MiniGameModal can follow here if needed
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    width: '85%',
    ...SHADOWS.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  hubContent: {
    width: '100%',
    alignItems: 'center',
  },
  gameOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    width: '100%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  gameDetail: {
    marginLeft: SPACING.md,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  gameDesc: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  energyContainer: {
    width: '100%',
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  energyFill: {
    height: '100%',
  },
  gameTarget: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.warning,
  },
  tapCount: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 5,
  },
  comboText: {
    marginTop: SPACING.md,
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    color: COLORS.primary,
  },
  catchingArea: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  starTarget: {
    position: 'absolute',
    padding: 10,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    margin: 5,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  cardFlipped: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardText: {
    fontSize: 24,
  },
});

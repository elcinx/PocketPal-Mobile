import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Modal, Image, Platform } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useGamification } from '../hooks/useGamification';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Coins, Pizza, Apple, Cake, Ghost, Star, Droplets, Carrot, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'food' | 'accessory' | 'wallpaper';
  icon: React.ReactNode;
  hunger?: number;
  xp?: number;
}

export const FOOD_ITEMS: ShopItem[] = [
  { id: 'item_carrot', name: 'Havuç', price: 10, type: 'food', icon: <Carrot color="#FF9800" />, hunger: 10, xp: 5 },
  { id: 'item_apple', name: 'Elma', price: 20, type: 'food', icon: <Apple color="#F44336" />, hunger: 20, xp: 10 },
  { id: 'item_pizza', name: 'Pizza', price: 40, type: 'food', icon: <Pizza color="#FFC107" />, hunger: 40, xp: 20 },
];

const ACCESSORY_ITEMS: ShopItem[] = [
  { id: 'bow', name: 'Pembe Kurdele', price: 150, type: 'accessory', icon: <Heart color="#FF4081" fill="#FF4081" /> },
  { id: 'glasses', name: 'Cool Gözlük', price: 300, type: 'accessory', icon: <Star color="#212121" /> },
  { id: 'hat', name: 'Mavi Şapka', price: 500, type: 'accessory', icon: <Star color="#3F51B5" /> },
  { id: 'crown', name: 'Kral Tacı 👑', price: 1000, type: 'accessory', icon: <Star color="#FFD700" /> },
];

const WALLPAPER_ITEMS: ShopItem[] = [
  { id: 'pink', name: 'Pembe Oda', price: 100, type: 'wallpaper', icon: <Droplets color="#FCE4EC" /> },
  { id: 'blue', name: 'Mavi Oda', price: 100, type: 'wallpaper', icon: <Droplets color="#E3F2FD" /> },
  { id: 'green', name: 'Bahçe', price: 100, type: 'wallpaper', icon: <Droplets color="#E8F5E9" /> },
  { id: 'stars', name: 'Yıldızlı Gece', price: 100, type: 'wallpaper', icon: <Droplets color="#F3E5F5" /> },
];

export const ShopScreen: React.FC = () => {
  const { 
    game, 
    setGame, 
    setStats, 
    unlockedAccessories, 
    setUnlockedAccessories, 
    selectedAccessory, 
    setSelectedAccessory, 
    wallpaper, 
    setWallpaper,
    foodInventory,
    setFoodInventory
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<'food' | 'accessory' | 'wallpaper'>('food');

  const handleBuy = (item: ShopItem) => {
    // Check if already owned/selected
    const isUnlocked = item.type === 'accessory' 
      ? unlockedAccessories.includes(item.id)
      : item.type === 'wallpaper' 
        ? wallpaper === item.id 
        : false;

    if (isUnlocked) {
      if (item.type === 'accessory') {
        setSelectedAccessory(selectedAccessory === item.id ? null : item.id);
      } else if (item.type === 'wallpaper') {
        setWallpaper(item.id);
      }
      return;
    }

    // Buy logic
    if (game.coins >= item.price) {
      setGame(prev => ({ ...prev, coins: prev.coins - item.price }));
      
      if (item.type === 'food') {
        setFoodInventory(prev => ({
          ...prev,
          [item.id]: (prev[item.id] || 0) + 1
        }));
        Alert.alert('Satın Alındı! 🍕', `${item.name} envanterine eklendi!`);
      } else if (item.type === 'accessory') {
        setUnlockedAccessories([...unlockedAccessories, item.id]);
        setSelectedAccessory(item.id);
      } else if (item.type === 'wallpaper') {
        setWallpaper(item.id);
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert('Yetersiz Coin! 🪙', 'Daha fazla oyun oynayarak coin toplayabilirsin.');
    }
  };

  const getItems = () => {
    if (activeTab === 'food') return FOOD_ITEMS;
    if (activeTab === 'accessory') return ACCESSORY_ITEMS;
    return WALLPAPER_ITEMS;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mağaza 🛍️</Text>
          <Text style={styles.subtitle}>En yeni ürünler burada!</Text>
        </View>
        <View style={styles.coinBadge}>
          <Coins size={20} color={COLORS.warning} />
          <Text style={styles.coinText}>{game.coins}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {(['food', 'accessory', 'wallpaper'] as const).map((tab) => (
          <TouchableOpacity 
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'food' ? 'Yemek' : tab === 'accessory' ? 'Aksesuar' : 'Duvar Kağıdı'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getItems()}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isUnlocked = item.type === 'accessory' 
            ? unlockedAccessories.includes(item.id)
            : item.type === 'wallpaper' 
              ? wallpaper === item.id 
              : false;
          const isSelected = item.type === 'accessory'
            ? selectedAccessory === item.id
            : item.type === 'wallpaper'
              ? wallpaper === item.id
              : false;

          return (
            <TouchableOpacity 
              style={[styles.card, isSelected && styles.selectedCard]} 
              onPress={() => handleBuy(item)}
              activeOpacity={0.8}
            >
              <View style={styles.itemIcon}>{item.icon}</View>
              <Text style={styles.itemName}>{item.name}</Text>
              
              {!isUnlocked && item.type !== 'food' ? (
                <View style={styles.priceTag}>
                  <Coins size={14} color={COLORS.warning} />
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              ) : item.type === 'food' ? (
                <View style={styles.priceTag}>
                  <Coins size={14} color={COLORS.warning} />
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              ) : (
                <Text style={styles.ownedText}>{isSelected ? 'Seçildi' : 'Sahipsin'}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? SPACING.md : SPACING.xl,
  },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  coinBadge: {
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
  coinText: { marginLeft: SPACING.xs, fontWeight: '900', color: COLORS.text, fontSize: 18 },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: { fontWeight: '700', color: COLORS.textLight, fontSize: 12 },
  activeTabText: { color: COLORS.white },
  list: { padding: SPACING.md, paddingHorizontal: SPACING.lg },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    margin: SPACING.sm,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.md,
  },
  selectedCard: {
    borderColor: COLORS.primary,
  },
  itemIcon: { 
    width: 50, 
    height: 50, 
    backgroundColor: COLORS.background, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: SPACING.sm 
  },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4, textAlign: 'center' },
  priceTag: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  priceText: { marginLeft: 4, fontWeight: '900', color: COLORS.text, fontSize: 14 },
  ownedText: { fontSize: 12, fontWeight: '900', color: COLORS.success, marginTop: 4 },
});

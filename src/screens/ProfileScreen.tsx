import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { User, Calendar, Zap, Star, Edit2, Check, X, Rabbit as RabbitIcon, Cat as CatIcon, Dog as DogIcon } from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { petName, setPetName, petType, setPetType, game, resetApp } = useAppContext();
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState(petName);

  const petTypes = [
    { id: 'rabbit', label: 'Tavşan', icon: <RabbitIcon size={20} /> },
    { id: 'cat', label: 'Kedi', icon: <CatIcon size={20} /> },
    { id: 'dog', label: 'Köpek', icon: <DogIcon size={20} /> },
  ];

  const handleSave = () => {
    if (newName.trim()) {
      setPetName(newName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewName(petName);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={60} color={COLORS.white} />
          </View>
          
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                autoFocus
                maxLength={15}
              />
              <View style={styles.editButtons}>
                <Pressable onPress={handleSave} style={[styles.iconButton, { backgroundColor: COLORS.success }]}>
                  <Check size={20} color={COLORS.white} />
                </Pressable>
                <Pressable onPress={handleCancel} style={[styles.iconButton, { backgroundColor: COLORS.danger }]}>
                  <X size={20} color={COLORS.white} />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{petName}</Text>
              <Pressable onPress={() => setIsEditing(true)} style={styles.editIcon}>
                <Edit2 size={18} color={COLORS.primary} />
              </Pressable>
            </View>
          )}
          
          <Text style={styles.typeText}>{petType.toUpperCase()} SAHİBİ</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arkadaşını Değiştir</Text>
          <View style={styles.typeSelector}>
            {petTypes.map((type) => (
              <Pressable
                key={type.id}
                onPress={() => setPetType(type.id as any)}
                style={[
                  styles.typeChip,
                  petType === type.id && styles.typeChipSelected
                ]}
              >
                <View style={[
                  styles.iconWrapper,
                  petType === type.id && styles.iconWrapperSelected
                ]}>
                  {React.cloneElement(type.icon as any, { 
                    color: petType === type.id ? COLORS.white : COLORS.textLight 
                  })}
                </View>
                <Text style={[
                  styles.typeChipText,
                  petType === type.id && styles.typeChipTextSelected
                ]}>
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Zap size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>{game.level}</Text>
            <Text style={styles.statLabel}>Seviye</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>{game.xp}</Text>
            <Text style={styles.statLabel}>Toplam XP</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color={COLORS.success} />
            <Text style={styles.statValue}>{game.streak}</Text>
            <Text style={styles.statLabel}>Günlük Seri</Text>
          </View>
        </View>

        <View style={styles.resetContainer}>
          <Text style={styles.resetDescription}>Tüm ilerlemenizi silip uygulamayı sıfırlamak ister misiniz?</Text>
          <Pressable 
            onPress={() => {
              Alert.alert(
                'Uygulamayı Sıfırla ⚠️', 
                'Tüm ilerlemeniz, coinleriniz ve evcil hayvanınız silinecek. Emin misiniz?',
                [
                  { text: 'Vazgeç', style: 'cancel' },
                  { text: 'Evet, Sıfırla', style: 'destructive', onPress: resetApp }
                ]
              );
            }} 
            style={styles.resetButton}
          >
            <X size={20} color={COLORS.danger} />
            <Text style={styles.resetButtonText}>Uygulamayı Sıfırla</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={infoStyles.infoTitle}>Evcil Hayvan Bilgileri</Text>
          <View style={infoStyles.infoRow}>
            <Text style={infoStyles.infoLabel}>Tür:</Text>
            <Text style={infoStyles.infoValue}>
              {petType === 'rabbit' ? 'Tavşan' : petType === 'cat' ? 'Kedi' : 'Köpek'}
            </Text>
          </View>
          <View style={infoStyles.infoRow}>
            <Text style={infoStyles.infoLabel}>Sahiplenme Tarihi:</Text>
            <Text style={infoStyles.infoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const infoStyles = StyleSheet.create({
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  infoLabel: { color: COLORS.textLight },
  infoValue: { fontWeight: '600', color: COLORS.text },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  profileHeader: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: { fontSize: 26, fontWeight: '900', color: COLORS.text },
  editIcon: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  editContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    fontSize: 20,
    color: COLORS.text,
    width: '80%',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    fontWeight: '700',
  },
  editButtons: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.sm,
  },
  typeText: { fontSize: 12, color: COLORS.textLight, fontWeight: '700', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xl },
  statCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    width: '30%',
    ...SHADOWS.sm,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginVertical: SPACING.xs },
  statLabel: { fontSize: 10, color: COLORS.textLight },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  infoLabel: { color: COLORS.textLight },
  infoValue: { fontWeight: '600', color: COLORS.text },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeChip: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  typeChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.accent,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconWrapperSelected: {
    backgroundColor: COLORS.primary,
  },
  typeChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  typeChipTextSelected: {
    color: COLORS.primary,
  },
  resetContainer: {
    backgroundColor: '#FFF1F1',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: '#FFDADA',
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  resetDescription: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.danger,
    ...SHADOWS.sm,
  },
  resetButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: SPACING.sm,
  },
});

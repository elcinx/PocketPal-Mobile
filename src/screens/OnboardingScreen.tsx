import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Pet } from '../components/Pet';
import { ActionButton } from '../components/ActionButton';
import { Heart, Rabbit as RabbitIcon, Cat as CatIcon, Dog as DogIcon } from 'lucide-react-native';

export const OnboardingScreen: React.FC = () => {
  const { setPetName, setPetType } = useAppContext();
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<'rabbit' | 'cat' | 'dog'>('rabbit');

  const handleStart = () => {
    if (name.trim()) {
      setPetName(name.trim());
      setPetType(selectedType);
    }
  };

  const types = [
    { id: 'rabbit', label: 'Tavşan', icon: <RabbitIcon size={20} /> },
    { id: 'cat', label: 'Kedi', icon: <CatIcon size={20} /> },
    { id: 'dog', label: 'Köpek', icon: <DogIcon size={20} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
        >
          <Text style={styles.title}>Yeni Arkadaşınla Tanış! ✨</Text>
          
          <View style={styles.petPreview}>
            <Pet type={selectedType} state="idle" />
          </View>

          <View style={styles.selectionContainer}>
            <Text style={styles.label}>Arkadaşını Seç</Text>
            <View style={styles.typeSelector}>
              {types.map((type) => (
                <Pressable
                  key={type.id}
                  onPress={() => setSelectedType(type.id as any)}
                  style={[
                    styles.typeChip,
                    selectedType === type.id && styles.typeChipSelected
                  ]}
                >
                  <View style={[
                    styles.iconWrapper,
                    selectedType === type.id && styles.iconWrapperSelected
                  ]}>
                    {React.cloneElement(type.icon as any, { 
                      color: selectedType === type.id ? COLORS.white : COLORS.textLight 
                    })}
                  </View>
                  <Text style={[
                    styles.typeChipText,
                    selectedType === type.id && styles.typeChipTextSelected
                  ]}>
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Onun Adı Ne Olsun?</Text>
            <TextInput 
              style={styles.input}
              placeholder="Örn: Pamuk"
              value={name}
              onChangeText={setName}
              placeholderTextColor={COLORS.textLight}
              maxLength={15}
            />
          </View>

          <ActionButton 
            title="Hemen Başla!" 
            onPress={handleStart}
            color={COLORS.primary}
            icon={<Heart color="white" size={24} />}
            style={styles.startButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 34,
  },
  petPreview: {
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  selectionContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconWrapperSelected: {
    backgroundColor: COLORS.primary,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  typeChipTextSelected: {
    color: COLORS.primary,
  },
  inputContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: '800',
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    fontWeight: '700',
    ...SHADOWS.sm,
  },
  startButton: {
    width: '100%',
  },
});

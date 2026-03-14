import React from 'react';
import { Text, StyleSheet, ViewStyle, View, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  title, 
  onPress, 
  color = COLORS.primary,
  icon,
  style 
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 200 });
    rotation.value = withSpring(Math.random() > 0.5 ? 2 : -2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 5, stiffness: 150 });
    rotation.value = withSpring(0);
  };

  return (
    <Pressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={[styles.button, { backgroundColor: color }, animatedStyle]}>
        {/* Subtle Highlight Layer for Glossy/Sweet Look */}
        <View style={styles.highlight} />
        
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.text}>{title}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottomWidth: 4, // 3D effect
    borderBottomColor: 'rgba(0,0,0,0.1)',
    ...SHADOWS.md,
  },
  highlight: {
    position: 'absolute',
    top: 4,
    left: '10%',
    width: '80%',
    height: '30%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: BORDER_RADIUS.md,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  text: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900', // Thicker font
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

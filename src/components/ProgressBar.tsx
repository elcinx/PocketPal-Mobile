import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  color: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, color }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${value}%`),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{Math.round(value)}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { backgroundColor: color }, animatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  valueText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  track: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
});

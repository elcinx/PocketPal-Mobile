import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { 
  Circle, 
  Ellipse, 
  Path, 
  G, 
  Defs, 
  LinearGradient, 
  Stop,
  Line
} from 'react-native-svg';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  useSharedValue,
  withSpring,
  Easing,
  useAnimatedProps
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

interface PetProps {
  type: 'rabbit' | 'cat' | 'dog';
  state: 'idle' | 'happy' | 'hungry' | 'sleeping' | 'cleaning' | 'dirty';
  accessory?: string | null;
}

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const Pet: React.FC<PetProps> = ({ type, state, accessory }) => {
  const bounceValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const breathingValue = useSharedValue(1);
  const eyeBlinkValue = useSharedValue(1);

  useEffect(() => {
    // Breathing animation
    breathingValue.value = withRepeat(
      withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Occasional Blinking
    const blinkInterval = setInterval(() => {
      eyeBlinkValue.value = withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (state === 'happy') {
      bounceValue.value = withSequence(
        withSpring(-60, { damping: 10, stiffness: 300, mass: 0.5 }),
        withSpring(0, { damping: 15, stiffness: 400 })
      );
      scaleValue.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withSpring(1)
      );
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: bounceValue.value },
        { scale: scaleValue.value * breathingValue.value }
      ],
    };
  });

  const blinkProps = useAnimatedProps(() => ({
    ry: 8 * eyeBlinkValue.value,
  }));

  const eyeShineProps = useAnimatedProps(() => ({
    opacity: eyeBlinkValue.value > 0.3 ? 1 : 0
  }));

  const renderRabbit = () => (
    <G>
      <Defs>
        <LinearGradient id="rabbitBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#F5F5F5" />
        </LinearGradient>
        <LinearGradient id="earInner" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFD1DC" />
          <Stop offset="1" stopColor="#FFB7C5" />
        </LinearGradient>
      </Defs>

      {/* Fluffy Tail */}
      <Circle cx="145" cy="145" r="12" fill="white" stroke="#E3D1D1" strokeWidth="0.5" />

      {/* Ears */}
      <G transform="translate(0, -10)">
        <Ellipse cx="70" cy="40" rx="12" ry="35" fill="white" stroke="#E3D1D1" strokeWidth="1" />
        <Ellipse cx="130" cy="40" rx="12" ry="35" fill="white" stroke="#E3D1D1" strokeWidth="1" />
        <Ellipse cx="70" cy="45" rx="6" ry="22" fill="url(#earInner)" />
        <Ellipse cx="130" cy="45" rx="6" ry="22" fill="url(#earInner)" />
      </G>
      
      {/* Lower Body */}
      <Ellipse cx="100" cy="140" rx="45" ry="50" fill="url(#rabbitBody)" stroke="#E3D1D1" strokeWidth="0.5" />

      {/* Main Head */}
      <Circle cx="100" cy="85" r="48" fill="url(#rabbitBody)" stroke="#E3D1D1" strokeWidth="0.5" />
      
      {/* Facial Features */}
      {/* Face (Yüz) */}
      {renderFace(90, 75, 85, state)}
      
      {/* Back Legs (Ayaklar) */}
      <Ellipse cx="65" cy="180" rx="15" ry="10" fill="white" stroke="#E3D1D1" strokeWidth="0.5" />
      <Ellipse cx="135" cy="180" rx="15" ry="10" fill="white" stroke="#E3D1D1" strokeWidth="0.5" />
      
      {/* Front Arms (Kollar) */}
      <Ellipse cx="60" cy="135" rx="10" ry="15" fill="white" stroke="#E3D1D1" strokeWidth="0.5" transform="rotate(-20 60 135)" />
      <Ellipse cx="140" cy="135" rx="10" ry="15" fill="white" stroke="#E3D1D1" strokeWidth="0.5" transform="rotate(20 140 135)" />
    </G>
  );

  const renderCat = () => (
    <G>
      <Defs>
        <LinearGradient id="catBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E3F2FD" />
          <Stop offset="1" stopColor="#BBDEFB" />
        </LinearGradient>
      </Defs>

      {/* Long Tail */}
      <Path 
        d="M 145 140 Q 180 120 160 80" 
        fill="none" 
        stroke="#BBDEFB" 
        strokeWidth="12" 
        strokeLinecap="round"
      />

      {/* Pointed Ears */}
      <G transform="translate(0, -5)">
        <Path d="M 60 70 L 80 30 L 100 70 Z" fill="#BBDEFB" stroke="#90CAF9" strokeWidth="1" />
        <Path d="M 100 70 L 120 30 L 140 70 Z" fill="#BBDEFB" stroke="#90CAF9" strokeWidth="1" />
        <Path d="M 70 65 L 80 45 L 90 65 Z" fill="#FFB7C5" />
        <Path d="M 110 65 L 120 45 L 130 65 Z" fill="#FFB7C5" />
      </G>

      {/* Body */}
      <Ellipse cx="100" cy="145" rx="42" ry="48" fill="url(#catBody)" stroke="#90CAF9" strokeWidth="0.5" />
      
      {/* Head */}
      <Circle cx="100" cy="90" r="48" fill="url(#catBody)" stroke="#90CAF9" strokeWidth="0.5" />
      
      {/* Face & Whiskers */}
      {renderFace(95, 80, 90, state)}
      <G stroke={COLORS.text} strokeWidth="1" opacity="0.6">
        <Line x1="50" y1="95" x2="30" y2="92" />
        <Line x1="50" y1="100" x2="30" y2="100" />
        <Line x1="150" y1="95" x2="170" y2="92" />
        <Line x1="150" y1="100" x2="170" y2="100" />
      </G>

      {/* Legs & Arms */}
      <Circle cx="70" cy="182" r="10" fill="white" stroke="#90CAF9" strokeWidth="0.5" />
      <Circle cx="130" cy="182" r="10" fill="white" stroke="#90CAF9" strokeWidth="0.5" />
      <Ellipse cx="65" cy="135" rx="8" ry="12" fill="white" stroke="#90CAF9" strokeWidth="0.5" transform="rotate(-15 65 135)" />
      <Ellipse cx="135" cy="135" rx="8" ry="12" fill="white" stroke="#90CAF9" strokeWidth="0.5" transform="rotate(15 135 135)" />
    </G>
  );

  const renderDog = () => (
    <G>
      <Defs>
        <LinearGradient id="dogBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFF9C4" />
          <Stop offset="1" stopColor="#FFF176" />
        </LinearGradient>
      </Defs>

      {/* Wagging Tail */}
      <Path 
        d="M 140 145 Q 160 160 170 145" 
        fill="none" 
        stroke="#FDD835" 
        strokeWidth="10" 
        strokeLinecap="round"
      />

      {/* Floppy Ears */}
      <G transform="translate(0, 0)">
        <Ellipse cx="55" cy="80" rx="10" ry="25" fill="#FDD835" transform="rotate(15 55 80)" />
        <Ellipse cx="145" cy="80" rx="10" ry="25" fill="#FDD835" transform="rotate(-15 145 80)" />
      </G>

      {/* Body */}
      <Ellipse cx="100" cy="145" rx="45" ry="42" fill="url(#dogBody)" stroke="#FBC02D" strokeWidth="0.5" />
      
      {/* Head */}
      <Circle cx="100" cy="95" r="48" fill="url(#dogBody)" stroke="#FBC02D" strokeWidth="0.5" />
      
      {/* Face & Snout */}
      {renderFace(100, 85, 95, state)}
      <Ellipse cx="100" cy="108" rx="10" ry="8" fill="white" opacity="0.6" />
      <Circle cx="100" cy="104" r="3" fill={COLORS.text} />

      {/* Legs & Arms */}
      <Circle cx="72" cy="180" r="11" fill="white" stroke="#FBC02D" strokeWidth="0.5" />
      <Circle cx="128" cy="180" r="11" fill="white" stroke="#FBC02D" strokeWidth="0.5" />
      <Circle cx="65" cy="138" r="9" fill="white" stroke="#FBC02D" strokeWidth="0.5" />
      <Circle cx="135" cy="138" r="9" fill="white" stroke="#FBC02D" strokeWidth="0.5" />
    </G>
  );

  const renderFace = (cheekY: number, eyeY: number, mouthY: number, petState: string) => (
    <G opacity={petState === 'dirty' ? 0.8 : 1}>
      {/* Dirt Spots if dirty */}
      {petState === 'dirty' && (
        <G opacity={0.6}>
          <Circle cx="80" cy={cheekY + 20} r="2" fill="#795548" />
          <Circle cx="120" cy={cheekY + 25} r="1.5" fill="#795548" />
          <Circle cx="90" cy={cheekY - 30} r="2.5" fill="#795548" />
        </G>
      )}

      {/* Cheeks */}
      <Circle cx="65" cy={cheekY} r="10" fill={petState === 'dirty' ? "#A1887F" : "#FFB7C5"} opacity={0.4} />
      <Circle cx="135" cy={cheekY} r="10" fill={petState === 'dirty' ? "#A1887F" : "#FFB7C5"} opacity={0.4} />
      
      {/* Kawaii Eyes */}
      <G>
        <AnimatedEllipse cx="75" cy={eyeY} rx="8" fill={COLORS.text} animatedProps={blinkProps} />
        <AnimatedEllipse cx="125" cy={eyeY} rx="8" fill={COLORS.text} animatedProps={blinkProps} />
        
        {/* Tired lines if dirty */}
        {petState === 'dirty' && (
          <G stroke={COLORS.text} strokeWidth="1" opacity="0.5">
            <Path d={`M 67 ${eyeY + 12} Q 75 ${eyeY + 15} 83 ${eyeY + 12}`} fill="none" />
            <Path d={`M 117 ${eyeY + 12} Q 125 ${eyeY + 15} 133 ${eyeY + 12}`} fill="none" />
          </G>
        )}

        {/* Eye Shines */}
        <G opacity={petState === 'dirty' ? 0.5 : 1}>
          <AnimatedCircle cx="72" cy={eyeY - 3} r="3.5" fill="white" animatedProps={eyeShineProps} />
          <AnimatedCircle cx="122" cy={eyeY - 3} r="3.5" fill="white" animatedProps={eyeShineProps} />
          <AnimatedCircle cx="78" cy={eyeY + 3} r="1.5" fill="white" animatedProps={eyeShineProps} />
          <AnimatedCircle cx="128" cy={eyeY + 3} r="1.5" fill="white" animatedProps={eyeShineProps} />
        </G>
      </G>
      
      {/* Tiny Mouth */}
      <Path 
        d={petState === 'dirty' 
          ? `M 95 ${mouthY + 5} Q 100 ${mouthY + 2} 105 ${mouthY + 5}` 
          : `M 97 ${mouthY} Q 100 ${mouthY + 3} 103 ${mouthY} M 95 ${mouthY + 6} Q 100 ${mouthY + 11} 105 ${mouthY + 6}`
        } 
        fill="none" 
        stroke={COLORS.text} 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
    </G>
  );

  const renderBubbles = () => {
    const bubbleCount = 6;
    return (
      <G>
        {[...Array(bubbleCount)].map((_, i) => (
          <Bubble key={i} index={i} />
        ))}
      </G>
    );
  };

  const renderAccessory = () => {
    if (!accessory) return null;

    switch (accessory) {
      case 'bow':
        return (
          <G transform="translate(100, 45)">
            <Path d="M -15 -10 Q -25 -20 -15 -30 Q -5 -20 -15 -10 Z" fill="#FF4081" />
            <Path d="M 15 -10 Q 25 -20 15 -30 Q 5 -20 15 -10 Z" fill="#FF4081" />
            <Circle cx="0" cy="-20" r="6" fill="#F50057" />
          </G>
        );
      case 'glasses':
        return (
          <G transform="translate(100, 85)" opacity="0.8">
            <Circle cx="-25" cy="0" r="15" fill="none" stroke="#212121" strokeWidth="3" />
            <Circle cx="25" cy="0" r="15" fill="none" stroke="#212121" strokeWidth="3" />
            <Path d="M -10 0 L 10 0" stroke="#212121" strokeWidth="3" />
          </G>
        );
      case 'hat':
        return (
          <G transform="translate(100, 40)">
            <Path d="M -40 0 L 40 0 L 30 -40 L -30 -40 Z" fill="#3F51B5" />
            <Ellipse cx="0" cy="0" rx="45" ry="8" fill="#303F9F" />
            <Path d="M -30 -15 L 30 -15" stroke="#FFD600" strokeWidth="5" />
          </G>
        );
      case 'crown':
        return (
          <G transform="translate(100, 35)">
            <Path d="M -25 0 L -25 -20 L -12 -10 L 0 -25 L 12 -10 L 25 -20 L 25 0 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
            <Circle cx="-15" cy="-5" r="2" fill="#FF0000" />
            <Circle cx="0" cy="-5" r="2" fill="#0000FF" />
            <Circle cx="15" cy="-5" r="2" fill="#00FF00" />
          </G>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Svg height="200" width="200" viewBox="0 0 200 200">
          {type === 'rabbit' && renderRabbit()}
          {type === 'cat' && renderCat()}
          {type === 'dog' && renderDog()}
          {renderAccessory()}
          {state === 'cleaning' && renderBubbles()}
        </Svg>
      </Animated.View>
    </View>
  );
};

const Bubble = ({ index }: { index: number }) => {
  const y = useSharedValue(160);
  const x = useSharedValue(60 + index * 15);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Randomized animation for each bubble
    const delay = index * 300;
    y.value = withRepeat(
      withSequence(
        withTiming(160, { duration: 0 }),
        withTiming(60, { duration: 2000 + Math.random() * 1000, easing: Easing.out(Easing.quad) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(0.7, { duration: 500 }),
        withTiming(0.7, { duration: 1000 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 0 }),
        withTiming(1.2, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    cx: x.value + Math.sin(y.value / 10) * 5,
    cy: y.value,
    r: 6 * scale.value,
    opacity: opacity.value
  }));

  return (
    <AnimatedCircle 
      fill="#E1F5FE" 
      stroke="#B3E5FC" 
      strokeWidth="1"
      animatedProps={animatedProps}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LetterStatus } from '../types/wordle';

interface LetterTileProps {
  letter: string;
  status: LetterStatus;
  onPress?: () => void;
  disabled?: boolean;
}

const COLORS = {
  empty: '#d3d6da',
  correct: '#6aaa64',
  'wrong-position': '#c9b458',
  'not-in-word': '#787c7e',
};

export function LetterTile({ letter, status, onPress, disabled = false }: LetterTileProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
    >
      <Animated.View style={[styles.tile, { backgroundColor: COLORS[status] }, animatedStyle]}>
        <Text style={styles.letter}>{letter.toUpperCase()}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 56,
    height: 56,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d3d6da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

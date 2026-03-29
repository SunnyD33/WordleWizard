import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LetterStatus } from '../types/wordle';

interface VirtualKeyboardProps {
  onLetterPress: (letter: string) => void;
  onBackspace: () => void;
  onStatusChange: (status: LetterStatus) => void;
  currentStatus: LetterStatus;
  isDark?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const STATUS_COLORS = {
  empty: '#d3d6da',
  correct: '#6aaa64',
  'wrong-position': '#c9b458',
  'not-in-word': '#787c7e',
};

const STATUS_LABELS = {
  empty: 'TAP',
  correct: 'CORRECT',
  'wrong-position': 'WRONG SPOT',
  'not-in-word': 'NOT IN WORD',
};

export function VirtualKeyboard({
  onLetterPress,
  onBackspace,
  onStatusChange,
  currentStatus,
  isDark = false,
}: VirtualKeyboardProps) {
  const handleKeyPress = (letter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLetterPress(letter);
  };

  const handleBackspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onBackspace();
  };

  const handleStatusPress = (status: LetterStatus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onStatusChange(status);
  };

  return (
    <View style={[
      styles.container, 
      isDark && styles.containerDark,
      { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }
    ]}>
      {/* Status selector */}
      <View style={styles.statusContainer}>
        <Text style={[styles.statusLabel, isDark && styles.statusLabelDark]}>Mark Letter As:</Text>
        <View style={styles.statusButtons}>
          <Pressable
            style={[
              styles.statusButton,
              { backgroundColor: STATUS_COLORS.correct },
              currentStatus === 'correct' && styles.statusButtonActive,
            ]}
            onPress={() => handleStatusPress('correct')}
          >
            <Text style={styles.statusButtonText}>✓ Correct</Text>
          </Pressable>
          <Pressable
            style={[
              styles.statusButton,
              { backgroundColor: STATUS_COLORS['wrong-position'] },
              currentStatus === 'wrong-position' && styles.statusButtonActive,
            ]}
            onPress={() => handleStatusPress('wrong-position')}
          >
            <Text style={styles.statusButtonText}>? Wrong Spot</Text>
          </Pressable>
          <Pressable
            style={[
              styles.statusButton,
              { backgroundColor: STATUS_COLORS['not-in-word'] },
              currentStatus === 'not-in-word' && styles.statusButtonActive,
            ]}
            onPress={() => handleStatusPress('not-in-word')}
          >
            <Text style={styles.statusButtonText}>✗ Not In Word</Text>
          </Pressable>
        </View>
      </View>

      {/* Keyboard */}
      <View style={styles.keyboard}>
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {row.map((letter) => (
              <Pressable
                key={letter}
                style={[styles.key, isDark && styles.keyDark]}
                onPress={() => handleKeyPress(letter)}
              >
                <Text style={[styles.keyText, isDark && styles.keyTextDark]}>{letter}</Text>
              </Pressable>
            ))}
          </View>
        ))}
        <View style={styles.keyboardRow}>
          <Pressable style={[styles.key, styles.backspaceKey]} onPress={handleBackspace}>
            <Text style={styles.keyText}>⌫</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  containerDark: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#3a3a3a',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  statusLabelDark: {
    color: '#a0a0a0',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusButtonActive: {
    borderColor: '#000000',
    transform: [{ scale: 1.02 }],
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  keyboard: {
    gap: 8,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  key: {
    backgroundColor: '#d3d6da',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyDark: {
    backgroundColor: '#565758',
  },
  backspaceKey: {
    minWidth: 70,
    backgroundColor: '#ff6b6b',
  },
  keyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  keyTextDark: {
    color: '#ffffff',
  },
});

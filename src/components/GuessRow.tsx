import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LetterTile } from './LetterTile';
import { GuessRow as GuessRowType } from '../types/wordle';

interface GuessRowProps {
  row: GuessRowType;
  onTilePress?: (index: number) => void;
  isActive?: boolean;
  isDark?: boolean;
}

export function GuessRow({ row, onTilePress, isActive = false, isDark = false }: GuessRowProps) {
  return (
    <View style={[styles.row, isActive && styles.activeRow]}>
      {row.tiles.map((tile, index) => (
        <LetterTile
          key={index}
          letter={tile.letter}
          status={tile.status}
          isDark={isDark}
          onPress={onTilePress ? () => onTilePress(index) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  activeRow: {
    opacity: 1,
  },
});
